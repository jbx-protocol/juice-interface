import { t } from '@lingui/macro'
import {
  CONTROLLER_CONFIG_EXPLANATION,
  CONTROLLER_MIGRATION_EXPLANATION,
  HOLD_FEES_EXPLANATION,
  TERMINAL_CONFIG_EXPLANATION,
  TERMINAL_MIGRATION_EXPLANATION,
} from 'components/strings'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { V2V3FundingCycleMetadata } from 'models/v2v3/fundingCycle'
import { useContext } from 'react'
import { FundingCycleListItem } from '../FundingCycleListItem'
import { AllowedValue } from './AllowedValue'
import { HoldFeesValue } from './HoldFeesValue'
import { PausePayValue } from './PausePayValue'

export function RulesListItems({
  fundingCycleMetadata,
  showDiffs,
}: {
  fundingCycleMetadata: V2V3FundingCycleMetadata
  showDiffs?: boolean
}) {
  const { fundingCycleMetadata: oldFundingCycleMetadata } =
    useContext(V2V3ProjectContext)

  const pausePayHasDiff =
    oldFundingCycleMetadata &&
    oldFundingCycleMetadata.pausePay !== fundingCycleMetadata.pausePay

  const allowSetTerminalsHasDiff =
    oldFundingCycleMetadata &&
    oldFundingCycleMetadata.global.allowSetTerminals !==
      fundingCycleMetadata.global.allowSetTerminals
  const allowSetControllerHasDiff =
    oldFundingCycleMetadata &&
    oldFundingCycleMetadata.global.allowSetController !==
      fundingCycleMetadata.global.allowSetController
  const allowTerminalMigrationHasDiff =
    oldFundingCycleMetadata &&
    oldFundingCycleMetadata.allowTerminalMigration !==
      fundingCycleMetadata.allowTerminalMigration
  const allowControllerMigrationHasDiff =
    oldFundingCycleMetadata &&
    oldFundingCycleMetadata.allowControllerMigration !==
      fundingCycleMetadata.allowControllerMigration

  const holdFeesHasDiff =
    oldFundingCycleMetadata &&
    oldFundingCycleMetadata.holdFees !== fundingCycleMetadata.holdFees

  return (
    <>
      <FundingCycleListItem
        name={t`Payments to this project`}
        value={<PausePayValue pausePay={fundingCycleMetadata.pausePay} />}
        oldValue={
          showDiffs && pausePayHasDiff ? (
            <PausePayValue pausePay={oldFundingCycleMetadata.pausePay} />
          ) : undefined
        }
      />
      <FundingCycleListItem
        name={t`Hold fees`}
        value={<HoldFeesValue holdFees={fundingCycleMetadata.holdFees} />}
        oldValue={
          showDiffs && holdFeesHasDiff ? (
            <HoldFeesValue holdFees={oldFundingCycleMetadata.holdFees} />
          ) : undefined
        }
        helperText={HOLD_FEES_EXPLANATION}
      />
      <FundingCycleListItem
        name={t`Set payment terminals`}
        value={
          <AllowedValue
            value={fundingCycleMetadata?.global.allowSetTerminals}
          />
        }
        oldValue={
          showDiffs && allowSetTerminalsHasDiff ? (
            <AllowedValue
              value={oldFundingCycleMetadata?.global.allowSetTerminals}
            />
          ) : undefined
        }
        helperText={TERMINAL_CONFIG_EXPLANATION}
      />
      <FundingCycleListItem
        name={t`Set controller`}
        value={
          <AllowedValue
            value={fundingCycleMetadata?.global.allowSetController}
          />
        }
        oldValue={
          showDiffs && allowSetControllerHasDiff ? (
            <AllowedValue
              value={oldFundingCycleMetadata?.global.allowSetController}
            />
          ) : undefined
        }
        helperText={CONTROLLER_CONFIG_EXPLANATION}
      />
      <FundingCycleListItem
        name={t`Migrate payment terminal`}
        value={
          <AllowedValue value={fundingCycleMetadata?.allowTerminalMigration} />
        }
        oldValue={
          showDiffs && allowTerminalMigrationHasDiff ? (
            <AllowedValue
              value={oldFundingCycleMetadata?.allowTerminalMigration}
            />
          ) : undefined
        }
        helperText={TERMINAL_MIGRATION_EXPLANATION}
      />
      <FundingCycleListItem
        name={t`Migrate controller`}
        value={
          <AllowedValue
            value={fundingCycleMetadata?.allowControllerMigration}
          />
        }
        oldValue={
          showDiffs && allowControllerMigrationHasDiff ? (
            <AllowedValue
              value={oldFundingCycleMetadata?.allowControllerMigration}
            />
          ) : undefined
        }
        helperText={CONTROLLER_MIGRATION_EXPLANATION}
      />
    </>
  )
}
