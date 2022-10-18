import { t } from '@lingui/macro'
import { Row } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import { readNetwork } from 'constants/networks'
import { useAppSelector } from 'hooks/AppSelector'
import { useMemo } from 'react'
import { useAvailableReconfigurationStrategies } from '../../../ReconfigurationRules'
import { DescriptionCol } from '../DescriptionCol'
import { emphasisedTextStyle } from '../styles'

export const RulesReview = () => {
  const availableBallotStrategies = useAvailableReconfigurationStrategies(
    readNetwork.name,
  )
  const {
    fundingCycleData: { ballot: customAddress },
    reconfigurationRuleSelection,
    fundingCycleMetadata,
  } = useAppSelector(state => state.editingV2Project)

  const pausePayments = useMemo(() => {
    if (fundingCycleMetadata.pausePay) {
      return t`Yes`
    } else {
      return t`No`
    }
  }, [fundingCycleMetadata.pausePay])

  const terminalConfiguration = useMemo(() => {
    if (fundingCycleMetadata.global.allowSetTerminals) {
      return t`Yes`
    } else {
      return t`No`
    }
  }, [fundingCycleMetadata.global.allowSetTerminals])

  const strategy = useMemo(() => {
    return availableBallotStrategies.find(
      strategy => strategy.id === reconfigurationRuleSelection,
    )?.name
  }, [availableBallotStrategies, reconfigurationRuleSelection])

  return (
    <div
      style={{
        paddingTop: '1.25rem',
        paddingBottom: '3rem',
      }}
    >
      <Row>
        <DescriptionCol
          span={6}
          title={t`Reconfiguration`}
          desc={
            <div style={emphasisedTextStyle()}>
              {strategy ? (
                strategy
              ) : customAddress ? (
                <FormattedAddress address={customAddress} />
              ) : (
                '??'
              )}
            </div>
          }
        />
        <DescriptionCol
          span={6}
          title={t`Pause payments`}
          desc={<div style={emphasisedTextStyle()}>{pausePayments}</div>}
        />
        <DescriptionCol
          span={6}
          title={t`Terminal configuration`}
          desc={
            <div style={emphasisedTextStyle()}>{terminalConfiguration}</div>
          }
        />
      </Row>
    </div>
  )
}
