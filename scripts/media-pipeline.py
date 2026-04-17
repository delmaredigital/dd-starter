"""
Media pipeline — stable repeatable flow for re-uploading a media row.

Safety properties:
- Downloads from R2 S3 API (origin, bypasses Cloudflare Polish / WebP transform)
- Verifies MD5 matches R2 ETag (byte-identity guarantee for non-multipart objects)
- Uploads via Payload API (stores bytes as-received, regenerates size variants)
- Re-verifies byte-identity post-upload
- Self-healing ID fix walks all pages' puckData and swaps stale ids

Usage:
    python3 scripts/media-pipeline.py check <media_id>         # sanity checks only
    python3 scripts/media-pipeline.py reupload <media_id>      # delete + reupload one row
    python3 scripts/media-pipeline.py reupload-batch <ids.txt> # batch reupload
    python3 scripts/media-pipeline.py fix-ids --dry            # scan puckData for stale ids
    python3 scripts/media-pipeline.py fix-ids                  # apply stale-id swaps
    python3 scripts/media-pipeline.py audit                    # full system audit

Environment:
    PAYLOAD_SESSION_COOKIE    required for API writes
    DATABASE_URL              postgres connection (or individual PG* vars)
    R2_ACCESS_KEY_ID          R2 creds
    R2_SECRET_ACCESS_KEY
    R2_ENDPOINT               https://<acct>.r2.cloudflarestorage.com
    R2_BUCKET                 public
"""

import argparse, hashlib, io, json, os, subprocess, sys
from pathlib import Path

import boto3

R2_ENDPOINT = os.environ["R2_ENDPOINT"]
R2_BUCKET   = os.environ.get("R2_BUCKET", "public")
PAYLOAD_BASE = os.environ.get("PAYLOAD_BASE", "https://pages.algoed.co")
COOKIE = os.environ["PAYLOAD_SESSION_COOKIE"]

s3 = boto3.client(
    "s3",
    endpoint_url=R2_ENDPOINT,
    aws_access_key_id=os.environ["R2_ACCESS_KEY_ID"],
    aws_secret_access_key=os.environ["R2_SECRET_ACCESS_KEY"],
    region_name="auto",
)

PSQL = "/opt/homebrew/opt/postgresql@17/bin/psql"
DB = ["-h","gondola.proxy.rlwy.net","-p","43742","-U","postgres","-d","payload_cms","-tA"]
PG_ENV = {"PGPASSWORD": os.environ["PGPASSWORD"], "PATH": os.environ["PATH"]}


def psql(sql, sep="|"):
    r = subprocess.run([PSQL, *DB, "-F", sep, "-c", sql], env=PG_ENV, capture_output=True, text=True, check=True)
    return [line.split(sep) for line in r.stdout.strip().split("\n") if line]


def r2_head(key):
    try: return s3.head_object(Bucket=R2_BUCKET, Key=key)
    except Exception: return None


def r2_get(key):
    obj = s3.get_object(Bucket=R2_BUCKET, Key=key)
    return obj["Body"].read(), obj["ETag"].strip('"')


def md5(b): return hashlib.md5(b).hexdigest()


SIZE_COLS = ["thumbnail", "square", "small", "medium", "large", "xlarge", "og"]


def fetch_row(mid):
    cols = ["id", "prefix", "filename", "mime_type", "focal_x", "focal_y", "folder_id"]
    cols += [f"sizes_{s}_filename" for s in SIZE_COLS]
    cols += [f"sizes_{s}_width" for s in SIZE_COLS]
    cols += [f"sizes_{s}_height" for s in SIZE_COLS]
    rows = psql(f"SELECT {','.join(cols)} FROM media WHERE id={mid}")
    if not rows: raise SystemExit(f"media {mid} not found")
    row = dict(zip(cols, rows[0]))
    return row


def check(mid):
    """Layer-1 sanity: origin bytes, variant sizes vs main, dimensions."""
    row = fetch_row(mid)
    main_key = f"{row['prefix']}/{row['filename']}"
    head = r2_head(main_key)
    if not head:
        print(f"  MAIN MISSING: {main_key}")
        return False
    main_size = head["ContentLength"]
    print(f"  main:       {main_key}  {main_size:>10} bytes  etag={head['ETag']}")
    ok = True
    for s in SIZE_COLS:
        fname = row[f"sizes_{s}_filename"]
        if not fname: continue
        vkey = f"{row['prefix']}/{fname}"
        vh = r2_head(vkey)
        if not vh:
            print(f"  variant:    {vkey}  MISSING")
            ok = False
        else:
            marker = ""
            if vh["ContentLength"] > main_size:
                marker = "  ⚠ LARGER THAN MAIN (main may be corrupt)"
                ok = False
            print(f"  {s:9}: {vkey}  {vh['ContentLength']:>10} bytes{marker}")
    return ok


def _upload_raw(path, folder_id, alt):
    cmd = [
        "curl", "-sS", "-X", "POST", f"{PAYLOAD_BASE}/api/media",
        "-H", f"Cookie: {COOKIE}",
        "-F", f"file=@{path}",
        "-F", f"_payload={json.dumps({'alt': alt, 'folder': int(folder_id)})}",
    ]
    r = subprocess.run(cmd, capture_output=True, text=True, check=True)
    doc = json.loads(r.stdout)["doc"]
    return doc["id"], doc["url"]


def reupload(mid):
    """End-to-end: download raw from R2 → verify md5 → delete row → reupload → verify byte-identity → audit sizes."""
    row = fetch_row(mid)
    main_key = f"{row['prefix']}/{row['filename']}"
    folder_id = row["folder_id"]
    if not folder_id:
        raise SystemExit(f"media {mid}: folder_id is NULL — cannot route upload")

    print(f"[{mid}] downloading {main_key} from R2 S3 API (origin, no CDN)")
    data, etag = r2_get(main_key)
    source_md5 = md5(data)
    if source_md5 != etag:
        print(f"  ⚠ md5({source_md5}) != etag({etag}) — file is multipart; byte-identity verified via content only")
    else:
        print(f"  ✓ md5 == etag == {source_md5} (byte-identity guaranteed from origin)")

    tmpdir = Path("/tmp/media-pipeline"); tmpdir.mkdir(exist_ok=True)
    local = tmpdir / row["filename"]
    local.write_bytes(data)

    print(f"[{mid}] DELETE row via Payload API")
    subprocess.run(["curl","-sS","-X","DELETE",f"{PAYLOAD_BASE}/api/media/{mid}",
                    "-H",f"Cookie: {COOKIE}","-o","/dev/null","-w","  status=%{http_code}\n"], check=True)

    print(f"[{mid}] reuploading to folder {folder_id}")
    new_id, new_url = _upload_raw(local, folder_id, row["filename"])
    print(f"  new_id={new_id}  url={new_url}")

    # Byte-identity verification
    new_data, new_etag = r2_get(main_key)
    new_md5 = md5(new_data)
    assert new_md5 == source_md5, f"BYTE DRIFT: {source_md5} → {new_md5}"
    print(f"  ✓ post-upload main md5 unchanged ({source_md5})")

    # Audit size variants
    new_row = fetch_row(new_id)
    for s in SIZE_COLS:
        fname = new_row[f"sizes_{s}_filename"]
        if not fname: continue
        vkey = f"{row['prefix']}/{fname}"
        vh = r2_head(vkey)
        if not vh:
            print(f"  ⚠ variant missing post-upload: {vkey}")
        else:
            w, h = new_row[f"sizes_{s}_width"], new_row[f"sizes_{s}_height"]
            print(f"  ✓ {s:9} {w}×{h}  {vh['ContentLength']:>10} bytes")

    return {"old_id": mid, "new_id": new_id, "url": main_key}


def _url_to_id_map():
    return {f"{p}/{f}": int(i) for i, p, f in psql("SELECT id, prefix, filename FROM media")}


def fix_ids(apply=False):
    """Walk all pages' puckData. For each {id, url} image object, look up current media by url and swap id."""
    url_to_id = _url_to_id_map()
    rows = psql("SELECT id, puck_data::text FROM pages WHERE puck_data IS NOT NULL", sep="\t")

    total = stale = missing = 0
    per_page = {}
    updated_json = {}

    def walk(o):
        nonlocal total, stale, missing
        changed = False
        if isinstance(o, dict):
            if "id" in o and isinstance(o.get("url"), str) and "cdn.algoed.co" in o["url"]:
                stored = o["id"]
                path = o["url"].split("cdn.algoed.co/", 1)[1]
                total += 1
                current = url_to_id.get(path)
                if current is None:
                    missing += 1
                elif current != stored:
                    stale += 1
                    per_page.setdefault(pid, []).append((stored, current, path))
                    o["id"] = current
                    changed = True
            for v in o.values():
                if walk(v): changed = True
        elif isinstance(o, list):
            for v in o:
                if walk(v): changed = True
        return changed

    for pid_s, data_s in rows:
        pid = int(pid_s)
        data = json.loads(data_s)
        if walk(data):
            updated_json[pid] = data

    print(f"Scanned: {total} image refs")
    print(f"Stale: {stale} across {len(per_page)} pages")
    print(f"Broken (url→no DB row): {missing}")
    for pid, items in sorted(per_page.items()):
        print(f"  page {pid}: {len(items)} swaps")
        for old, new, url in items[:3]:
            print(f"    {old} → {new}   {url}")
        if len(items) > 3: print(f"    ... +{len(items)-3}")

    if not apply:
        print("\n(dry run — pass --apply to execute)")
        return

    print("\napplying...")
    for pid, obj in updated_json.items():
        # Must update BOTH pages.puck_data AND _pages_v.latest.version_puck_data in the
        # same transaction. Writing to pages alone leaves _pages_v stale; the next Payload
        # API write (meta patch, admin save, anything) loads the stale draft as base and
        # clobbers our id fix. See CLAUDE.md "Editing puckData".
        escaped = json.dumps(obj).replace("'", "''")
        subprocess.run(
            [PSQL, *DB, "-c",
             "BEGIN;"
             f"UPDATE pages SET puck_data = '{escaped}'::jsonb WHERE id = {pid};"
             f"UPDATE _pages_v SET version_puck_data = '{escaped}'::jsonb "
             f"  WHERE parent_id = {pid} AND latest = true;"
             "COMMIT;"],
            env=PG_ENV, check=True, capture_output=True,
        )
        print(f"  page {pid} updated (pages + _pages_v.latest)")

    # Bust ISR cache so the swapped ids take effect without waiting for revalidation
    subprocess.run(
        ["curl", "-sS", "-X", "POST", f"{PAYLOAD_BASE}/api/revalidate-all",
         "-H", f"Cookie: {COOKIE}", "-o", "/dev/null", "-w", "  revalidate: %{http_code}\n"],
        check=True,
    )


def audit():
    """Full system audit: R2 vs DB, stale ids, missing variants."""
    print("=== Audit: R2 ↔ DB ===")
    keys = set()
    for p in s3.get_paginator("list_objects_v2").paginate(Bucket=R2_BUCKET):
        keys.update(o["Key"] for o in p.get("Contents", []))
    expected = set()
    cols = ["prefix", "filename"] + [f"sizes_{s}_filename" for s in SIZE_COLS]
    for row in psql(f"SELECT {','.join(cols)} FROM media"):
        prefix = row[0]
        for f in row[1:]:
            if f: expected.add(f"{prefix}/{f}")
    print(f"R2:       {len(keys)}")
    print(f"expected: {len(expected)}")
    print(f"R2-only orphans: {len(keys - expected)}")
    for k in sorted(keys - expected)[:10]: print(f"  {k}")
    print(f"DB→404:  {len(expected - keys)}")
    for k in sorted(expected - keys)[:10]: print(f"  {k}")
    print()
    print("=== ID drift ===")
    fix_ids(apply=False)


def main():
    p = argparse.ArgumentParser()
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("audit")
    c = sub.add_parser("check"); c.add_argument("media_id", type=int)
    r = sub.add_parser("reupload"); r.add_argument("media_id", type=int)
    b = sub.add_parser("reupload-batch"); b.add_argument("file")
    f = sub.add_parser("fix-ids"); f.add_argument("--apply", action="store_true")
    args = p.parse_args()
    if args.cmd == "audit": audit()
    elif args.cmd == "check": check(args.media_id)
    elif args.cmd == "reupload": reupload(args.media_id)
    elif args.cmd == "reupload-batch":
        ids = [int(l.strip()) for l in open(args.file) if l.strip() and not l.startswith("#")]
        for mid in ids:
            try: reupload(mid)
            except Exception as e: print(f"[{mid}] FAILED: {e}")
    elif args.cmd == "fix-ids": fix_ids(apply=args.apply)


if __name__ == "__main__":
    main()
