import {
  DetailedHTMLProps,
  InputHTMLAttributes,
  useEffect,
  useState,
} from 'react'
import { twMerge } from 'tailwind-merge'

export const JuiceInputNumber = ({
  value,
  formatter,
  parser,
  onChange,
  className,
  ...props
}: {
  value?: string
  formatter?: (s?: string | undefined) => string
  parser?: (s?: string | undefined) => string
  onChange?: (s: string) => void
  className?: string
} & DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>) => {
  const [val, setVal] = useState<string>()

  useEffect(() => {
    setVal(formatter ? formatter(value) : value)
  }, [value, formatter])

  return (
    <input
      value={val}
      className={twMerge(
        'text-primary stroke-secondary rounded-lg border border-smoke-300 bg-smoke-50 px-4 py-2 text-black dark:border-slate-300 dark:bg-slate-600 dark:text-slate-100 dark:placeholder:text-slate-300',
        className,
      )}
      onChange={e => {
        if (!onChange) return

        const _value = e.target.value
        const parsedVal = parser ? parser(_value) : _value
        onChange(parsedVal)
      }}
      {...props}
    />
  )
}
