/**
 * Custom Puck field helpers for competition components.
 * Client-only — uses Puck editor components.
 */
import { FieldLabel, RichTextMenu } from '@puckeditor/core'
import type { RichtextField } from '@puckeditor/core'
import { Color } from '@tiptap/extension-color'
import { TextStyle } from '@tiptap/extension-text-style'

/** Color picker that always returns valid hex. For fields that must have a color. */
export function createColorField({ label }: { label: string }) {
  return {
    type: 'custom' as const,
    label,
    render: ({ name, onChange, value, field }: {
      name: string
      onChange: (val: string) => void
      value: string
      field: { label?: string }
    }) => (
      <FieldLabel label={field.label || label}>
        <input
          type="color"
          name={name}
          value={value || '#000000'}
          onChange={(e) => onChange(e.target.value)}
          style={{ width: '100%', height: 40, cursor: 'pointer' }}
        />
      </FieldLabel>
    ),
  }
}

/** Toggle pill field for choosing between primary dark and primary bright. */
export function createBrandPickerField({ label }: { label: string }) {
  return {
    type: 'custom' as const,
    label,
    render: ({ onChange, value, field }: {
      name: string
      onChange: (val: string) => void
      value: string
      field: { label?: string }
    }) => {
      const selected = value || 'bright'
      const pill = (val: string, text: string) => (
        <button
          type="button"
          onClick={() => onChange(val)}
          style={{
            flex: 1,
            padding: '8px 12px',
            fontSize: 12,
            fontWeight: selected === val ? 600 : 400,
            border: `1px solid ${selected === val ? '#333' : '#ccc'}`,
            borderRadius: 4,
            background: selected === val ? '#333' : '#fff',
            color: selected === val ? '#fff' : '#333',
            cursor: 'pointer',
          }}
        >
          {text}
        </button>
      )
      return (
        <FieldLabel label={field.label || label}>
          <div style={{ display: 'flex', gap: 4 }}>
            {pill('bright', 'Bright')}
            {pill('dark', 'Dark')}
          </div>
        </FieldLabel>
      )
    },
  }
}

/** Slider field for numeric values (e.g. opacity). Shows value label + range input. */
export function createSliderField({ label, min = 0, max = 100, step = 1, suffix = '%' }: {
  label: string; min?: number; max?: number; step?: number; suffix?: string
}) {
  return {
    type: 'custom' as const,
    label,
    render: ({ name, onChange, value, field }: {
      name: string
      onChange: (val: number) => void
      value: number
      field: { label?: string }
    }) => (
      <FieldLabel label={field.label || label}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input
            type="range"
            name={name}
            min={min}
            max={max}
            step={step}
            value={value ?? min}
            onChange={(e) => onChange(Number(e.target.value))}
            style={{ flex: 1, height: 40, cursor: 'pointer' }}
          />
          <span style={{ fontSize: 12, minWidth: 40, textAlign: 'right' }}>
            {value ?? min}{suffix}
          </span>
        </div>
      </FieldLabel>
    ),
  }
}

/** Color picker with a clear button. Returns hex or empty string. For optional colors. */
export function createOptionalColorField({ label }: { label: string }) {
  return {
    type: 'custom' as const,
    label,
    render: ({ name, onChange, value, field }: {
      name: string
      onChange: (val: string) => void
      value: string
      field: { label?: string }
    }) => (
      <FieldLabel label={field.label || label}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <input
            type="color"
            name={name}
            value={value || '#ffffff'}
            onChange={(e) => onChange(e.target.value)}
            style={{ flex: 1, height: 40, cursor: 'pointer' }}
          />
          {value && (
            <button
              type="button"
              onClick={() => onChange('')}
              style={{
                padding: '8px 12px',
                fontSize: 12,
                border: '1px solid #ccc',
                borderRadius: 4,
                background: '#fff',
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          )}
        </div>
        {!value && <div style={{ fontSize: 12, color: '#888', marginTop: 4 }}>No color set (transparent)</div>}
      </FieldLabel>
    ),
  }
}

const colorSelector = () => ({ hasColor: false })

/** Richtext field with text color support via Tiptap Color extension. */
export function createRichTextField({ label }: { label: string }): RichtextField<typeof colorSelector> {
  return {
    type: 'richtext',
    label,
    tiptap: {
      extensions: [TextStyle, Color],
      selector: colorSelector,
    },
    renderMenu: ({ children, editor }) => {
      const currentColor = (editor?.getAttributes('textStyle')?.color as string) ?? null
      return (
        <RichTextMenu>
          {children}
          <RichTextMenu.Group>
            <RichTextMenu.Control
              active={Boolean(currentColor)}
              title="Text Color"
              icon={
                <input
                  type="color"
                  value={currentColor ?? '#000000'}
                  onChange={(e) => editor?.chain().focus().setColor(e.target.value).run()}
                  style={{
                    width: 16,
                    height: 16,
                    padding: 0,
                    border: 'none',
                    borderRadius: 2,
                    cursor: 'pointer',
                    background: 'transparent',
                  }}
                />
              }
              onClick={() => {}}
            />
            {currentColor && (
              <RichTextMenu.Control
                active={false}
                title="Clear Color"
                icon={<span style={{ fontSize: 12, lineHeight: 1 }}>✕</span>}
                onClick={() => editor?.chain().focus().unsetColor().run()}
              />
            )}
          </RichTextMenu.Group>
        </RichTextMenu>
      )
    },
  }
}
