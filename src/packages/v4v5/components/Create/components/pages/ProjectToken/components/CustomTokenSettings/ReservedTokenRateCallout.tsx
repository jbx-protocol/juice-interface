import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import { Callout } from 'components/Callout/Callout'
import { useMemo } from 'react'
import { formattedNum } from 'utils/format/formatNumber'
import { ProjectTokensFormProps } from '../../hooks/useProjectTokenForm'

export const ReservedTokenRateCallout: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  const form = Form.useFormInstance<ProjectTokensFormProps>()
  const initialMintRate = Form.useWatch('initialMintRate', form)
  const reservedTokensPercentage = Form.useWatch(
    'reservedTokensPercentage',
    form,
  )

  const reservedTokens = useMemo(() => {
    if (!initialMintRate) return 0
    const imr = parseFloat(initialMintRate)
    return (imr * (reservedTokensPercentage ?? 0)) / 100
  }, [initialMintRate, reservedTokensPercentage])

  const contributorTokens = useMemo(() => {
    if (!initialMintRate) return 0
    return parseFloat(initialMintRate) - reservedTokens
  }, [initialMintRate, reservedTokens])

  return (
    <Callout.Info noIcon collapsible={false}>
      <Trans>When someone pays your project 1 ETH:</Trans>
      <ul className="list-disc pl-10">
        <li>
          <Trans>
            {formattedNum(contributorTokens)} tokens will be sent to the payer.
          </Trans>
        </li>
        <li>
          <Trans>{formattedNum(reservedTokens)} tokens will be reserved.</Trans>
        </li>
      </ul>
    </Callout.Info>
  )
}
