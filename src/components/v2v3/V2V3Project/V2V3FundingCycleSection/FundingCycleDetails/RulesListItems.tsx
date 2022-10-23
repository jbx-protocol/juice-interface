import { t, Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import FormattedAddress from 'components/FormattedAddress'
import FundingCycleDetailWarning from 'components/Project/FundingCycleDetailWarning'
import { FUNDING_CYCLE_WARNING_TEXT } from 'constants/fundingWarningText'
import {
  V2V3FundingCycle,
  V2V3FundingCycleMetadata,
} from 'models/v2v3/fundingCycle'
import { getBallotStrategyByAddress } from 'utils/v2v3/ballotStrategies'
import { getUnsafeV2V3FundingCycleProperties } from 'utils/v2v3/fundingCycle'
import {
  OWNER_MINTING_EXPLAINATION,
  RECONFIG_RULES_EXPLAINATION,
  TERMINAL_CONFIG_EXPLAINATION,
} from '../settingExplanations'
import { FundingCycleListItem } from './FundingCycleListItem'

export function RulesListItems({
  fundingCycle,
  fundingCycleMetadata,
}: {
  fundingCycle: V2V3FundingCycle
  fundingCycleMetadata: V2V3FundingCycleMetadata
}) {
  const riskWarningText = FUNDING_CYCLE_WARNING_TEXT()
  const unsafeFundingCycleProperties = getUnsafeV2V3FundingCycleProperties(
    fundingCycle,
    fundingCycleMetadata,
  )

  const ballotStrategy = getBallotStrategyByAddress(fundingCycle.ballot)

  const ballotWarningText = unsafeFundingCycleProperties.noBallot
    ? riskWarningText.noBallot
    : riskWarningText.customBallot

  return (
    <>
      <FundingCycleListItem
        name={t`Payments`}
        value={
          fundingCycleMetadata?.pausePay ? (
            <Trans>Paused</Trans>
          ) : (
            <Trans>Enabled</Trans>
          )
        }
      />
      <FundingCycleListItem
        name={t`Owner token minting`}
        value={
          <FundingCycleDetailWarning
            showWarning={fundingCycleMetadata?.allowMinting}
            tooltipTitle={riskWarningText.allowMinting}
          >
            {fundingCycleMetadata?.allowMinting ? (
              <Trans>Allowed</Trans>
            ) : (
              <Trans>Disabled</Trans>
            )}
          </FundingCycleDetailWarning>
        }
        helperText={OWNER_MINTING_EXPLAINATION}
      />
      <FundingCycleListItem
        name={t`Terminal configuration`}
        value={
          fundingCycleMetadata?.global.allowSetTerminals ? (
            <Trans>Allowed</Trans>
          ) : (
            <Trans>Disabled</Trans>
          )
        }
        helperText={TERMINAL_CONFIG_EXPLAINATION}
      />
      <FundingCycleListItem
        name={t`Reconfiguration strategy`}
        value={
          <FundingCycleDetailWarning
            showWarning={
              unsafeFundingCycleProperties.noBallot ||
              unsafeFundingCycleProperties.customBallot
            }
            tooltipTitle={ballotWarningText}
          >
            <Tooltip title={<FormattedAddress address={fundingCycle.ballot} />}>
              <span style={{ textDecoration: 'underline' }}>
                {ballotStrategy.name}
              </span>
            </Tooltip>
          </FundingCycleDetailWarning>
        }
        helperText={RECONFIG_RULES_EXPLAINATION}
      />
    </>
  )
}
