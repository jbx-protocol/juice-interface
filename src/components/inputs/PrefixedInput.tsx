import { JuiceInput } from './JuiceTextInput'

export default function PrefixedInput({
  prefix,
  value,
  onChange,
}: {
  prefix: string
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
    <JuiceInput
      prefix={prefix}
      value={value?.includes(prefix) ? value.replaceAll(prefix, '') : value}
      onChange={e => onValueChange(e.target.value)}
    />
  )
}
