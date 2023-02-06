import useMobile from 'hooks/Mobile'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { twJoin } from 'tailwind-merge'
import { Tooltip } from 'antd'
import { t } from '@lingui/macro'

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
  const isMobile = useMobile()
  const iconClasses =
    'h-full flex items-center justify-center md:hover:bg-haze-600 active:bg-haze-600 w-5/12 md:w-[27px]'
  const valueIsMax = value === maxValue

  return (
    <div
      className={twJoin(
        'absolute right-1.5 top-1.5 items-center text-sm',
        'flex justify-between rounded-full bg-haze-400 text-smoke-25',
        isMobile ? 'h-9 w-3/5' : 'h-7 w-1/2',
      )}
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
              ? 'text-tertiary cursor-default active:bg-haze-400 md:hover:bg-haze-400'
              : '',
          )}
        >
          <PlusOutlined />
        </div>
      </Tooltip>
    </div>
  )
}
