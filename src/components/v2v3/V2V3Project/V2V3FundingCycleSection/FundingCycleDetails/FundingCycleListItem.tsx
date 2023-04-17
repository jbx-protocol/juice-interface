import { Tooltip } from 'antd'
import { classNames } from 'utils/classNames'
import { DiffedItem } from '../../../shared/DiffedItem'

// e.g. 'Distribution limit', 'Start', 'End', etc.
export function FundingCycleListItem({
  name,
  helperText,
  value,
  oldValue,
  subItem,
}: {
  name: string
  value: string | JSX.Element
  oldValue?: string | JSX.Element
  helperText?: string | JSX.Element
  subItem?: boolean
}) {
  const hasDiff = oldValue && value !== oldValue

  const _value = (
    <>
      {hasDiff ? <DiffedItem value={oldValue} diffStatus={'old'} /> : null}
      <DiffedItem value={value} diffStatus={hasDiff ? 'new' : undefined} />
    </>
  )

  if (helperText) {
    return (
      <div
        className={classNames(
          'mb-2 flex cursor-default flex-wrap',
          subItem ? 'ml-5 text-xs' : 'text-sm',
        )}
      >
        <Tooltip title={helperText} overlayInnerStyle={{ width: '400px' }}>
          <div className="flex font-medium">
            <div
              className={classNames(
                'underline decoration-smoke-500 decoration-dotted dark:decoration-slate-200',
                subItem ? 'h-4' : '',
              )}
            >
              {name}
            </div>
            :
          </div>{' '}
        </Tooltip>
        {_value}
      </div>
    )
  }

  return (
    <div
      className={classNames(
        'mb-2 flex flex-wrap',
        subItem ? 'ml-5 text-xs' : 'text-sm',
      )}
    >
      <div className="font-medium">{name}:</div> {_value}
    </div>
  )
}
