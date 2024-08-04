import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import TooltipLabel from 'components/TooltipLabel'
import CurrencySymbol from 'components/currency/CurrencySymbol'
import { Ether } from 'juice-sdk-core'
import { NativeTokenValue } from 'juice-sdk-react'
import { formatWad } from 'utils/format/formatNumber'
import { helpPagePath } from 'utils/routes'
import { V4CurrencyOption } from '../models/v4CurrencyOption'
import { V4_CURRENCY_ETH } from '../utils/currency'
import { amountSubFee } from '../utils/math'

export const FeeTooltipLabel = ({
  currency,
  amount,
  feePerBillion,
}: {
  currency: V4CurrencyOption
  amount: bigint | undefined
  feePerBillion: bigint | undefined
}) => {
  if (!amount || !currency || !feePerBillion) return null
  const amountSubFeeValue = amountSubFee(amount, feePerBillion) ?? 0n
  const feePercentage = new Ether(feePerBillion).format()
  return (
    <TooltipLabel
      label={
        <Trans>
          {currency === V4_CURRENCY_ETH ? (
            <NativeTokenValue wei={amountSubFeeValue} />
          ) : (
            <>
              <CurrencySymbol currency={'USD'} />
              {formatWad(amountSubFeeValue, { precision: 4 })}
            </>
          )}{' '}
          after {feePercentage}% JBX membership fee
        </Trans>
      }
      tip={
        <Trans>
          Payouts to Ethereum addresses incur a {feePercentage}% fee. Your
          project will receive JBX in return.{' '}
          <ExternalLink href={helpPagePath(`/dao/jbx/#about-fees`)}>
            Learn more
          </ExternalLink>
          .
        </Trans>
      }
    />
  )
}
