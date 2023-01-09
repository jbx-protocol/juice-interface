import useMobile from 'hooks/Mobile'
import { PlusOutlined, MinusOutlined } from '@ant-design/icons'
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
  const isMobile = useMobile()
  const iconClasses = twJoin(
    'h-full flex items-center justify-center hover:bg-haze-600',
    isMobile ? 'w-5/12' : 'w-[27px]',
  )
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
      <div className="flex items-center font-medium">{value}</div>
      <div
        onClick={valueIsMax ? undefined : onIncrement}
        className={twJoin(
          iconClasses,
          'rounded-r-full pr-0.5',
          valueIsMax ? 'bg-haze-700' : '',
        )}
      >
        <PlusOutlined />
      </div>
    </div>
  )
}
