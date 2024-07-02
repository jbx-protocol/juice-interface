/* eslint-disable @typescript-eslint/no-explicit-any */

export const PayInput = ({
  className,
  placeholder,
  value,
  onChange,
  onBlur,
  name,
}: any) => (
  <input
    data-testid="pay-input"
    className={className}
    placeholder={placeholder}
    value={value.amount?.toString() ?? ''}
    name={name}
    onChange={e =>
      onChange({ amount: Number(e.target.value), currency: value.currency })
    }
    onBlur={onBlur}
  />
)
