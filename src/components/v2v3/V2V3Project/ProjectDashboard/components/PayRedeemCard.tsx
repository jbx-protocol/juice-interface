import { ArrowDownIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button } from 'antd'
import { ONE_BILLION } from 'constants/numbers'
import { PV_V2 } from 'constants/pv'
import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useWallet } from 'hooks/Wallet'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useProjectLogoSrc } from 'hooks/useProjectLogoSrc'
import Image from 'next/image'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { formatAmount } from 'utils/format/formatAmount'
import { formatCurrencyAmount } from 'utils/format/formatCurrencyAmount'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
import { useProjectCart } from '../hooks/useProjectCart'
import { useTokensPerEth } from '../hooks/useTokensPerEth'
import { useCartSummary } from './Cart/hooks/useCartSummary'

export type PayRedeemCardProps = {
  className?: string
}

export const PayRedeemCard: React.FC<PayRedeemCardProps> = ({ className }) => {
  const cart = useProjectCart()
  const { payProject, walletConnected } = useCartSummary()
  const { projectId } = useProjectMetadataContext()
  const wallet = useWallet()
  const tokenLogo = useProjectLogoSrc({ projectId, pv: PV_V2 })
  const [payAmount, setPayAmount] = useState<string>()

  const tokenReceivedAmount = useTokensPerEth({
    amount: parseFloat(payAmount || '0'),
    currency: V2V3_CURRENCY_ETH,
  })

  const insufficientBalance = useMemo(() => {
    if (!wallet.balance) return false
    const amount = parseFloat(payAmount || '0')
    const balance = parseFloat(wallet.balance)
    return amount > balance
  }, [payAmount, wallet.balance])

  useEffect(() => {
    cart.dispatch({
      type: 'addPayment',
      payload: {
        amount: parseFloat(payAmount || '0'),
        currency: V2V3_CURRENCY_ETH,
      },
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payAmount])

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
          <PayRedeemInput
            label={t`You pay`}
            token={{
              balance: wallet.balance,
              image: <div />,
              ticker: 'ETH',
              type: 'eth',
            }}
            value={payAmount}
            onChange={setPayAmount}
          />
          <PayRedeemInput
            label={t`You receive`}
            readOnly
            token={{
              balance: undefined,
              image: tokenLogo ? (
                <Image src={tokenLogo} alt="Token logo" fill />
              ) : undefined,
              ticker: tokenReceivedAmount.receivedTokenSymbolText || 'TOKENS',
            }}
            value={
              tokenReceivedAmount.receivedTickets &&
              !!parseFloat(tokenReceivedAmount.receivedTickets)
                ? tokenReceivedAmount.receivedTickets
                : ''
            }
          />
        </div>
        <DownArrow className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
      </div>

      <Button
        type="primary"
        className="mt-6 w-full"
        size="large"
        disabled={insufficientBalance || payAmount === '0' || !payAmount}
        onClick={payProject}
      >
        {walletConnected ? (
          insufficientBalance ? (
            <Trans>Insufficient balance</Trans>
          ) : (
            <Trans>Pay project</Trans>
          )
        ) : (
          <Trans>Connect wallet to pay</Trans>
        )}
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
  readOnly,
  token,
  value,
  onChange,
}: {
  className?: string
  label?: string
  readOnly?: boolean
  token: {
    type?: 'eth' | 'other'
    ticker: string
    image: ReactNode
    balance: string | undefined
  }
  value?: string | undefined
  onChange?: (value: string | undefined) => void
}) => {
  token.type = token.type || 'other'

  const converter = useCurrencyConverter()

  const convertedValue = useMemo(() => {
    if (!value || token.type !== 'eth') return undefined
    const usdPerEth = converter.usdPerEth
    const n = parseFloat(value)
    if (Number.isNaN(n)) return undefined
    const amount = usdPerEth ? n * usdPerEth : undefined
    return {
      amount,
      currency: V2V3_CURRENCY_USD,
    }
  }, [converter, token.type, value])

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    // only allow numbers and decimals
    const value = event.target.value.replace(/[^0-9.]/g, '')
    const num = parseFloat(value)
    if (Number.isNaN(num)) return onChange?.(value)
    if (num > ONE_BILLION) return onChange?.(ONE_BILLION.toString())

    return onChange?.(value)
  }

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
          onChange={handleInputChange}
        />
        <TokenBadge token={token.ticker} image={token.image} />
      </div>
      <div className="flex min-h-[22px] justify-between">
        <span>{convertedValue && formatCurrencyAmount(convertedValue)}</span>
        <span>
          {token.balance && <>Balance: {formatAmount(token.balance)}</>}
        </span>
      </div>
    </div>
  )
}

const TokenBadge = ({
  className,
  token,
  image,
}: {
  className?: string
  token: string
  image: ReactNode
}) => {
  return (
    <div
      className={twMerge(
        'flex items-center gap-2 rounded-full border border-grey-200 bg-white py-1 px-1.5 pr-3 text-base font-medium text-grey-700 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-100',
        className,
      )}
    >
      <div className="relative h-6 w-6 overflow-hidden rounded-full bg-bluebs-500">
        {image}
      </div>
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
