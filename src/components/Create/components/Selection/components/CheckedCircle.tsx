import { CheckCircleFilled } from '@ant-design/icons'
import { classNames } from 'utils/classNames'

export const CheckedCircle: React.FC<{
  checked: boolean
  defocused: boolean
}> = ({ checked, defocused }) => {
  if (checked) {
    return <CheckCircleFilled className="text-xl text-haze-400" />
  }
  return (
    <div
      className={classNames(
        'h-5 w-5 rounded-full border border-solid',
        defocused
          ? 'border-smoke-200 dark:border-slate-400'
          : 'border-smoke-300 dark:border-slate-200',
      )}
    />
  )
}
