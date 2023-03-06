import { CheckCircleFilled } from '@ant-design/icons'
import { twMerge } from 'tailwind-merge'

export const CheckedCircle: React.FC<{
  className?: string
  checked: boolean
  defocused?: boolean
}> = ({ className, checked, defocused }) => {
  if (checked) {
    return <CheckCircleFilled className="text-xl leading-none text-haze-400" />
  }
  return (
    <div
      className={twMerge(
        'h-5 w-5 rounded-full border border-solid',
        defocused
          ? 'border-smoke-200 dark:border-slate-400'
          : 'border-smoke-300 dark:border-slate-200',
        className,
      )}
    />
  )
}
