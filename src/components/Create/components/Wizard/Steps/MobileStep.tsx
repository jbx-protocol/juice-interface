import { CheckCircleFilled } from '@ant-design/icons'
import { useCallback } from 'react'
import { classNames } from 'utils/classNames'

export const MobileStep = ({
  step,
  index,
  selected,
  isCompleted,
  onClick,
}: {
  step: { id: string; title: string; disabled: boolean }
  index: number
  selected: boolean
  isCompleted: boolean
  onClick?: (index: number) => void
}) => {
  const handleOnClick = useCallback(() => {
    if (step.disabled) return
    onClick?.(index)
  }, [index, onClick, step.disabled])

  return (
    <div
      className={classNames(
        'select-none text-base leading-5 hover:bg-smoke-100 dark:hover:bg-slate-300',
        selected ? 'font-medium' : 'font-normal',
        !selected
          ? step.disabled
            ? 'cursor-not-allowed'
            : 'cursor-pointer'
          : 'bg-smoke-200 dark:bg-slate-400',
        step.disabled ? 'text-grey-400 dark:text-slate-400' : '',
      )}
      onClick={handleOnClick}
    >
      <div className="flex items-center gap-1 py-4 px-6">
        <span>
          {index + 1}. {step.title}
        </span>
        {isCompleted && <CheckCircleFilled className="text-bluebs-500" />}
      </div>
    </div>
  )
}
