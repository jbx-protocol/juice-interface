import { ArrowDownIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import { twMerge } from 'tailwind-merge'

export type PayRedeemCardProps = {
  className?: string
}

export const PayRedeemCard: React.FC<PayRedeemCardProps> = ({ className }) => {
  return (
    <div
      className={twMerge(
        'flex flex-col rounded-lg border border-grey-200 p-5 pb-6 dark:border-slate-600 dark:bg-slate-700',
        className,
      )}
    >
      <div>
        <ChoiceButton selected>Pay</ChoiceButton>
        <ChoiceButton>Redeem</ChoiceButton>
      </div>

      <div className="relative mt-5">
        <div className="flex flex-col gap-y-2">
          <PayRedeemInput label={t`You pay`} />
          <PayRedeemInput label={t`You receive`} readOnly />
        </div>
        <DownArrow className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <Button
        type="primary"
        className="mt-6 w-full"
        size="large"
        disabled
        onClick={() => {
          console.info('Pay project')
        }}
      >
        <Trans>Pay project</Trans>
      </Button>
    </div>
  )
}

const ChoiceButton = ({
  children,
  onClick,
  selected,
}: {
  children: React.ReactNode
  onClick?: () => void
  selected?: boolean
}) => {
  return (
    <button
      onClick={onClick}
      className={twMerge(
        'w-fit rounded-full px-4 py-1.5 text-base font-medium transition-colors',
        selected
          ? 'bg-grey-100 text-grey-900 dark:bg-slate-900 dark:text-slate-100'
          : 'bg-transparent text-grey-500 hover:bg-grey-100 hover:text-grey-900 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-slate-100',
      )}
    >
      {children}
    </button>
  )
}

const PayRedeemInput = ({
  className,
  label,
  value,
  readOnly,
  onChange,
}: {
  className?: string
  label?: string
  value?: string
  readOnly?: boolean
  onChange?: (value: string) => void
}) => {
  return (
    <div
      className={twMerge(
        'flex flex-col gap-y-2 overflow-hidden rounded-lg border border-grey-200 bg-grey-50 px-4 py-3 text-sm text-grey-500 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-200',
        className,
      )}
    >
      <label>{label}</label>
      <div className="flex w-full justify-between gap-2">
        <input
          className="min-w-0 bg-transparent text-3xl font-medium text-grey-900 placeholder:text-grey-300 focus:outline-none dark:text-slate-100 dark:placeholder-slate-400"
          value={value}
          placeholder="0"
          readOnly={readOnly}
          onChange={e => onChange?.(e.target.value)}
        />
        <TokenBadge token="ETH" />
      </div>
      <div className="flex min-h-[22px] justify-between">
        <span>$2,679.65</span>
        <span>Balance: 21.36</span>
      </div>
    </div>
  )
}

const TokenBadge = ({
  className,
  token,
}: {
  className?: string
  token: string
}) => {
  return (
    <div
      className={twMerge(
        'flex items-center gap-2 rounded-full border border-grey-200 bg-white py-1 px-1.5 pr-3 text-base font-medium text-grey-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100',
        className,
      )}
    >
      <div className="h-6 w-6 rounded-full bg-bluebs-500" />
      {token}
    </div>
  )
}

const DownArrow = ({ className }: { className?: string }) => {
  return (
    <div
      className={twMerge(
        'absolute top-1/2 left-1/2 flex h-10 w-10 -translate-x-1/2 -translate-y-1/2 items-center justify-center bg-grey-50 p-1 dark:bg-slate-900',
        className,
      )}
    >
      <div className="flex items-center justify-center rounded-lg border border-grey-200 bg-white p-2 dark:border-slate-600 dark:bg-slate-600">
        <ArrowDownIcon className="h-4 w-4 stroke-2 text-grey-400 dark:text-slate-300" />
      </div>
    </div>
  )
}
