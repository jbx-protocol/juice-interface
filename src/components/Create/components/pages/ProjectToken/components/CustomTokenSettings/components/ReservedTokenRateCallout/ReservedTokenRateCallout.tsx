import { Trans } from '@lingui/macro'
import { Form } from 'antd'
import { CreateCallout } from 'components/Create/components/CreateCallout'
import { useMemo } from 'react'
import { formattedNum } from 'utils/format/formatNumber'
import { ProjectTokensFormProps } from '../../../../hooks/ProjectTokenForm'

export const ReservedTokenRateCallout: React.FC = () => {
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
    <CreateCallout.Info noIcon collapsible={false}>
      <Trans>
        <span>Contributor rate:</span>{' '}
        <span className="whitespace-nowrap">
          {formattedNum(contributorTokens)} / 1 ETH
        </span>
      </Trans>
      <br />
      <Trans>
        <span>Reserved rate:</span>{' '}
        <span className="whitespace-nowrap">
          {formattedNum(reservedTokens)} / 1 ETH
        </span>
      </Trans>
    </CreateCallout.Info>
  )
}
