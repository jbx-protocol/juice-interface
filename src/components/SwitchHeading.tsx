import { Switch } from 'antd'
import { PropsWithChildren } from 'react'
import { twMerge } from 'tailwind-merge'

export default function SwitchHeading({
  className,
  children,
  checked,
  onChange,
  disabled,
}: PropsWithChildren<{
  className?: string
  checked: boolean
  disabled?: boolean
  onChange?: (checked: boolean) => void
}>) {
  return (
    <div className={twMerge('flex items-center', className)}>
      <Switch
        className="mr-2"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <label className="m-0 text-base text-black dark:text-slate-100">
        {children}
      </label>
    </div>
  )
}
