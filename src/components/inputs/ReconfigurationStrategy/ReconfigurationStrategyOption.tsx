import { CheckCircleFilled } from '@ant-design/icons'
import { BallotStrategy } from 'models/ballot'
import { classNames } from 'utils/classNames'

export default function ReconfigurationStrategyOption({
  title,
  content,
  strategy,
  selected,
  onSelectBallot,
}: {
  title: string
  content: JSX.Element
  strategy: BallotStrategy
  selected: boolean
  onSelectBallot: (strategy: BallotStrategy) => void
}) {
  return (
    <div
      className={classNames(
        'flex rounded-sm border bg-white p-4 transition-colors dark:bg-slate-700',
        selected
          ? 'border-bluebs-500'
          : 'cursor-pointer border-smoke-300 hover:border-smoke-500 dark:border-slate-300 dark:hover:border-slate-100',
      )}
      onClick={() => onSelectBallot(strategy)}
    >
      <div className="mr-2 min-w-[20px] text-bluebs-500 dark:text-bluebs-300">
        {selected ? <CheckCircleFilled /> : null}
      </div>
      <div className="text-black dark:text-slate-100">
        <h3
          className={classNames(
            selected
              ? 'text-bluebs-500 dark:text-bluebs-300'
              : 'text-black dark:text-slate-100',
          )}
        >
          {title}
        </h3>
        {content}
      </div>
    </div>
  )
}
