// Material Symbols Outlined — local SVG components.
// Settings: wght400, FILL0, GRAD0, opsz24 (default combo).
//
// Path data fetched from Google's CDN and verified character-by-character
// against https://fonts.google.com/icons exports:
//   fonts.gstatic.com/s/i/short-term/release/materialsymbolsoutlined/{name}/default/24px.svg
//
// Why local SVGs instead of a font or lib:
//   - Zero runtime dependency, SSR-safe (inline SVG markup)
//   - Tree-shaken by default (only imported icons ship)
//   - No font-loading flash or network request
//   - To add an icon: copy path from Google Fonts Icons at the same settings

export type IconProps = React.SVGProps<SVGSVGElement>

// Shared icon map for Puck select fields. Components look up by name.
export const iconMap: Record<string, (props: IconProps) => React.JSX.Element> = {}

// Puck select options — { label, value } for icon picker fields.
export const iconOptions: { label: string; value: string }[] = []

function register(name: string, label: string, component: (props: IconProps) => React.JSX.Element) {
  iconMap[name] = component
  iconOptions.push({ label, value: name })
}

export function CalendarToday(props: IconProps) {
  return (
    <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />
    </svg>
  )
}

export function CheckCircle(props: IconProps) {
  return (
    <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" {...props}>
      <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
    </svg>
  )
}

export function EventList(props: IconProps) {
  return (
    <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M640-120q-33 0-56.5-23.5T560-200v-160q0-33 23.5-56.5T640-440h160q33 0 56.5 23.5T880-360v160q0 33-23.5 56.5T800-120H640Zm0-80h160v-160H640v160ZM80-240v-80h360v80H80Zm560-280q-33 0-56.5-23.5T560-600v-160q0-33 23.5-56.5T640-840h160q33 0 56.5 23.5T880-760v160q0 33-23.5 56.5T800-520H640Zm0-80h160v-160H640v160ZM80-640v-80h360v80H80Zm640 360Zm0-400Z" />
    </svg>
  )
}

export function SportsScore(props: IconProps) {
  return (
    <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M360-720h80v-80h-80v80Zm160 0v-80h80v80h-80ZM360-400v-80h80v80h-80Zm320-160v-80h80v80h-80Zm0 160v-80h80v80h-80Zm-160 0v-80h80v80h-80Zm160-320v-80h80v80h-80Zm-240 80v-80h80v80h-80ZM200-160v-640h80v80h80v80h-80v80h80v80h-80v320h-80Zm400-320v-80h80v80h-80Zm-160 0v-80h80v80h-80Zm-80-80v-80h80v80h-80Zm160 0v-80h80v80h-80Zm80-80v-80h80v80h-80Z" />
    </svg>
  )
}

export function Groups(props: IconProps) {
  return (
    <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M0-240v-63q0-43 44-70t116-27q13 0 25 .5t23 2.5q-14 21-21 44t-7 48v65H0Zm240 0v-65q0-32 17.5-58.5T307-410q32-20 76.5-30t96.5-10q53 0 97.5 10t76.5 30q32 20 49 46.5t17 58.5v65H240Zm540 0v-65q0-26-6.5-49T754-397q11-2 22.5-2.5t23.5-.5q72 0 116 26.5t44 70.5v63H780Zm-455-80h311q-10-20-55.5-35T480-370q-55 0-100.5 15T325-320ZM160-440q-33 0-56.5-23.5T80-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T160-440Zm640 0q-33 0-56.5-23.5T720-520q0-34 23.5-57t56.5-23q34 0 57 23t23 57q0 33-23 56.5T800-440Zm-320-40q-50 0-85-35t-35-85q0-51 35-85.5t85-34.5q51 0 85.5 34.5T600-600q0 50-34.5 85T480-480Zm0-80q17 0 28.5-11.5T520-600q0-17-11.5-28.5T480-640q-17 0-28.5 11.5T440-600q0 17 11.5 28.5T480-560Zm1 240Zm-1-280Z" />
    </svg>
  )
}

export function License(props: IconProps) {
  return (
    <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M395-475q-35-35-35-85t35-85q35-35 85-35t85 35q35 35 35 85t-35 85q-35 35-85 35t-85-35ZM240-40v-309q-38-42-59-96t-21-115q0-134 93-227t227-93q134 0 227 93t93 227q0 61-21 115t-59 96v309l-240-80-240 80Zm410-350q70-70 70-170t-70-170q-70-70-170-70t-170 70q-70 70-70 170t70 170q70 70 170 70t170-70ZM320-159l160-41 160 41v-124q-35 20-75.5 31.5T480-240q-44 0-84.5-11.5T320-283v124Zm160-62Z" />
    </svg>
  )
}

export function RewardedAds(props: IconProps) {
  return (
    <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M536.5-543.5Q560-567 560-600t-23.5-56.5Q513-680 480-680t-56.5 23.5Q400-633 400-600t23.5 56.5Q447-520 480-520t56.5-23.5ZM280-120v-80h160v-124q-49-11-87.5-41.5T296-442q-75-9-125.5-65.5T120-640v-40q0-33 23.5-56.5T200-760h80v-80h400v80h80q33 0 56.5 23.5T840-680v40q0 76-50.5 132.5T664-442q-18 46-56.5 76.5T520-324v124h160v80H280Zm0-408v-152h-80v40q0 38 22 68.5t58 43.5Zm285 93q35-35 35-85v-240H360v240q0 50 35 85t85 35q50 0 85-35Zm115-93q36-13 58-43.5t22-68.5v-40h-80v152Zm-200-52Z" />
    </svg>
  )
}

export function Public(props: IconProps) {
  return (
    <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M324-111.5Q251-143 197-197t-85.5-127Q80-397 80-480t31.5-156Q143-709 197-763t127-85.5Q397-880 480-880t156 31.5Q709-817 763-763t85.5 127Q880-563 880-480t-31.5 156Q817-251 763-197t-127 85.5Q563-80 480-80t-156-31.5ZM440-162v-78q-33 0-56.5-23.5T360-320v-40L168-552q-3 18-5.5 36t-2.5 36q0 121 79.5 212T440-162Zm276-102q41-45 62.5-100.5T800-480q0-98-54.5-179T600-776v16q0 33-23.5 56.5T520-680h-80v80q0 17-11.5 28.5T400-560h-80v80h240q17 0 28.5 11.5T600-440v120h40q26 0 47 15.5t29 40.5Z" />
    </svg>
  )
}

export function Genetics(props: IconProps) {
  return (
    <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M200-40v-40q0-139 58-225.5T418-480q-102-88-160-174.5T200-880v-40h80v40q0 11 .5 20.5T282-840h396q1-10 1.5-19.5t.5-20.5v-40h80v40q0 139-58 225.5T542-480q102 88 160 174.5T760-80v40h-80v-40q0-11-.5-20.5T678-120H282q-1 10-1.5 19.5T280-80v40h-80Zm138-640h284q13-19 22.5-38t17.5-42H298q8 22 17.5 41.5T338-680Zm142 148q20-17 39-34t36-34H405q17 17 36 34t39 34Zm-75 172h150q-17-17-36-34t-39-34q-20 17-39 34t-36 34ZM298-200h364q-8-22-17.5-41.5T622-280H338q-13 19-22.5 38T298-200Z" />
    </svg>
  )
}

export function Syringe(props: IconProps) {
  return (
    <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M156-513q-11-12-11-28.5t11-28.5l112-112-43-43-12 12q-12 12-28.5 12T156-713q-11-11-11-28t11-28l80-80q12-12 28.5-12t28.5 12q11 11 11 28t-11 28l-12 12 43 43 112-112q12-12 28.5-12t28.5 12q12 12 12 28.5T493-793l-27 26 295 295q23 23 23 56.5T761-359l-28 29 189 188H808L676-274l-28 29q-23 23-56.5 23T535-245L240-540l-27 27q-12 11-28.5 11T156-513Zm140-83 295 295 113-114-60-61-56 56q-12 11-28.5 11.5T532-419q-12-12-12-28.5t12-28.5l56-56-60-60-56 56q-12 11-28.5 11T415-536q-11-12-11-28.5t11-28.5l56-56-61-61-114 114Zm0 0 114-114-114 114Z" />
    </svg>
  )
}

export function WbIncandescent(props: IconProps) {
  return (
    <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M440-80v-120h80v120h-80ZM80-440v-80h120v80H80Zm680 0v-80h120v80H760Zm-40 276-84-84 56-56 84 84-56 56Zm-480 0-56-56 84-84 56 56-84 84Zm98.5-174.5Q280-397 280-480q0-48 21.5-89.5T360-640v-200h240v200q37 29 58.5 70.5T680-480q0 83-58.5 141.5T480-280q-83 0-141.5-58.5ZM440-676q10-2 20-3t20-1q10 0 20 1t20 3v-84h-80v84Zm40 316q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35Zm0-120Z" />
    </svg>
  )
}

export function PrecisionManufacturing(props: IconProps) {
  return (
    <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M159-120v-120h124L181-574q-27-15-44.5-44T119-680q0-50 35-85t85-35q39 0 69.5 22.5T351-720h128v-40q0-17 11.5-28.5T519-800q9 0 17.5 4t14.5 12l68-64q9-9 21.5-11.5T665-856l156 72q12 6 16.5 17.5T837-744q-6 12-17.5 15.5T797-730l-144-66-94 88v56l94 86 144-66q11-5 23-1t17 15q6 12 1 23t-17 17l-156 74q-12 6-24.5 3.5T619-512l-68-64q-6 6-14.5 11t-17.5 5q-17 0-28.5-11.5T479-600v-40H351q-3 8-6.5 15t-9.5 15l200 370h144v120H159Zm108.5-531.5Q279-663 279-680t-11.5-28.5Q256-720 239-720t-28.5 11.5Q199-697 199-680t11.5 28.5Q222-640 239-640t28.5-11.5ZM365-240h78L271-560h-4l98 320Zm78 0Z" />
    </svg>
  )
}

export function Category(props: IconProps) {
  return (
    <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" {...props}>
      <path d="m260-520 220-360 220 360H260ZM700-80q-75 0-127.5-52.5T520-260q0-75 52.5-127.5T700-440q75 0 127.5 52.5T880-260q0 75-52.5 127.5T700-80Zm-580-20v-320h320v320H120Zm580-60q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29Zm-500-20h160v-160H200v160Zm202-420h156l-78-126-78 126Zm78 0ZM360-340Zm340 80Z" />
    </svg>
  )
}

export function School(props: IconProps) {
  return (
    <svg viewBox="0 -960 960 960" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z" />
    </svg>
  )
}

// Register all icons for picker use
register('CalendarToday', 'Calendar Today', CalendarToday)
register('CheckCircle', 'Check Circle', CheckCircle)
register('EventList', 'Event List', EventList)
register('SportsScore', 'Sports Score', SportsScore)
register('Groups', 'Groups', Groups)
register('License', 'License', License)
register('RewardedAds', 'Rewarded Ads', RewardedAds)
register('Public', 'Public', Public)
register('Genetics', 'Genetics', Genetics)
register('Syringe', 'Syringe', Syringe)
register('WbIncandescent', 'Wb Incandescent', WbIncandescent)
register('PrecisionManufacturing', 'Precision Manufacturing', PrecisionManufacturing)
register('Category', 'Category', Category)
register('School', 'School', School)
