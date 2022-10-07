import { Select } from 'antd'
import { useLayoutEffect, useState } from 'react'

const FONT_OPTIONS = [
  'DM-Mono',
  'Tarnac-Sans',
  'Centra-Mono',
  'GT-Pressura-Mono',
  'Capsules',
] as const

type FontOption = typeof FONT_OPTIONS[number]

export default function FontSelector() {
  const [font, setFont] = useState<FontOption>('DM-Mono')

  useLayoutEffect(() => {
    const body = document.getElementsByTagName('body')[0]
    body.className = font
  }, [font])

  return (
    <div>
      <Select
        style={{ flex: 1, minWidth: '6.75rem' }}
        defaultValue={FONT_OPTIONS[0]}
        value={font}
        onChange={setFont}
      >
        {FONT_OPTIONS.map(o => (
          <Select.Option key={0} value={o}>
            {o}
          </Select.Option>
        ))}
      </Select>
    </div>
  )
}
