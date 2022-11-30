import { CheckCircleFilled } from '@ant-design/icons'
import { ThemeContext } from 'contexts/themeContext'
import { BallotStrategy } from 'models/ballot'
import { useContext } from 'react'
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
  const { colors } = useContext(ThemeContext).theme

  return (
    <div
      className={classNames(
        'flex rounded-sm border border-solid bg-white p-4 transition-colors dark:bg-slate-700',
        selected
          ? 'border-haze-400'
          : 'cursor-pointer border-smoke-300 hover:border-smoke-500 dark:border-slate-300 dark:hover:border-slate-100',
      )}
      onClick={() => onSelectBallot(strategy)}
    >
      <div
        style={{
          marginRight: 10,
          minWidth: 20,
          color: colors.text.action.primary,
        }}
      >
        {selected ? <CheckCircleFilled /> : null}
      </div>
      <div style={{ color: colors.text.primary }}>
        <h3
          style={{
            color: selected ? colors.text.action.primary : colors.text.primary,
          }}
        >
          {title}
        </h3>
        {content}
      </div>
    </div>
  )
}
