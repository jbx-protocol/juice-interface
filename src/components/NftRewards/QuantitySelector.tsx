import { MinusOutlined, PlusOutlined } from '@ant-design/icons'
import { t } from '@lingui/macro'
import { Tooltip } from 'antd'
import { twJoin } from 'tailwind-merge'

// + / - buttons that appear in top-right of selected NFT cards on project page
export function QuantitySelector({
  value,
  maxValue,
  onIncrement,
  onDecrement,
}: {
  value: number
  maxValue?: number
  onIncrement: VoidFunction
  onDecrement: VoidFunction
}) {
  const iconClasses =
    'h-full flex items-center justify-center md:hover:bg-bluebs-600 active:bg-bluebs-600 w-5/12 md:w-[27px]'
  const valueIsMax = value === maxValue

  return (
    <div
      className="absolute right-1.5 top-1.5 flex h-9 w-3/5 items-center justify-between rounded-full bg-bluebs-500 text-sm text-smoke-25 md:h-7 md:w-1/2"
      onClick={e => e.stopPropagation()}
    >
      <div
        onClick={onDecrement}
        className={twJoin(iconClasses, 'rounded-l-full pl-0.5')}
      >
        <MinusOutlined />
      </div>
      <div className="flex cursor-default select-none items-center font-medium">
        {value}
      </div>
      <Tooltip title={valueIsMax ? t`Max. supply reached` : undefined}>
        <div
          onClick={valueIsMax ? undefined : onIncrement}
          className={twJoin(
            iconClasses,
            'rounded-r-full pr-0.5',
            valueIsMax
              ? 'text-tertiary cursor-default active:bg-bluebs-500 md:hover:bg-bluebs-500'
              : '',
          )}
        >
          <PlusOutlined />
        </div>
      </Tooltip>
    </div>
  )
}
