import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import TooltipLabel from 'components/TooltipLabel'
import CurrencySymbol from 'components/currency/CurrencySymbol'
import ETHAmount from 'components/currency/ETHAmount'
import { BigNumber } from 'ethers'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import { V2V3_CURRENCY_ETH } from 'packages/v2v3/utils/currency'
import { amountSubFee, formatFee } from 'packages/v2v3/utils/math'
import { formatWad } from 'utils/format/formatNumber'
import { helpPagePath } from 'utils/helpPagePath'

export const FeeTooltipLabel = ({
  currency,
  amountWad,
  feePerBillion,
}: {
  currency: V2V3CurrencyOption
  amountWad: BigNumber | undefined
  feePerBillion: BigNumber | undefined
}) => {
  if (!amountWad || !currency || !feePerBillion) return null
  const amountSubFeeValue = amountSubFee(amountWad, feePerBillion)
  const feePercentage = formatFee(feePerBillion)
  return (
    <TooltipLabel
      label={
        <Trans>
          {currency === V2V3_CURRENCY_ETH ? (
            <ETHAmount amount={amountSubFeeValue} />
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
