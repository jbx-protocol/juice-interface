import { Input } from 'antd'

export default function PrefixInput({
  prefix = 'https://',
  value,
  onChange,
}: {
  prefix?: string
  value?: string
  onChange?: (val: string) => void
}) {
  const onValueChange = (value: string) => {
    if (value.includes(prefix)) {
      const newValue = value.replaceAll(prefix, '')
      onChange?.(newValue)
    } else {
      onChange?.(value)
    }
  }

  return (
    <Input
      prefix={prefix}
      value={value?.includes(prefix) ? value.replaceAll(prefix, '') : value}
      onChange={e => onValueChange(e.target.value)}
    />
  )
}
