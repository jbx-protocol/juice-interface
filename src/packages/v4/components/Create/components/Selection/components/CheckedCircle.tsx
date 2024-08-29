import { CheckCircleFilled } from '@ant-design/icons'
import { twMerge } from 'tailwind-merge'
import { classNames } from 'utils/classNames'

export const CheckedCircle: React.FC<
  React.PropsWithChildren<{
    className?: string
    checked: boolean
    defocused?: boolean
  }>
> = ({ className, checked, defocused }) => {
  if (checked) {
    return (
      <CheckCircleFilled
        className={classNames(
          `text-xl leading-none text-bluebs-500`,
          className,
        )}
      />
    )
  }
  return (
    <div
      className={twMerge(
        'h-5 w-5 rounded-full border',
        defocused
          ? 'border-smoke-200 dark:border-slate-400'
          : 'border-smoke-300 dark:border-slate-200',
        className,
      )}
    />
  )
}
