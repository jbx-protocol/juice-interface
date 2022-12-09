import { Tooltip } from 'antd'
import { classNames } from 'utils/classNames'

function ListItemValue({ value }: { value: string | JSX.Element }) {
  return (
    <div className="ml-1 whitespace-nowrap text-grey-500 dark:text-grey-300">
      {value}
    </div>
  )
}

// e.g. 'Distribution limit', 'Start', 'End', etc.
export function FundingCycleListItem({
  name,
  helperText,
  value,
  subItem,
}: {
  name: string
  value: string | JSX.Element
  helperText?: string | JSX.Element
  subItem?: boolean
}) {
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
                'text-decoration-underline text-decoration-dashed text-decoration-secondary',
                subItem ? 'h-4' : '',
              )}
            >
              {name}
            </div>
            :
          </div>{' '}
        </Tooltip>

        <ListItemValue value={value} />
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
      <div className="font-medium">{name}:</div> <ListItemValue value={value} />
    </div>
  )
}
