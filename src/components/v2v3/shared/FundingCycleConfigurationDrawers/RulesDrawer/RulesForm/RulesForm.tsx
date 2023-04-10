import { isAddress } from '@ethersproject/address'
import { Trans } from '@lingui/macro'
import { Button, Form, Switch } from 'antd'
import FormItemLabel from 'components/FormItemLabel'
import ReconfigurationStrategySelector from 'components/ReconfigurationStrategy/ReconfigurationStrategySelector'
import {
  CONTROLLER_CONFIG_EXPLANATION,
  CONTROLLER_MIGRATION_EXPLANATION,
  HOLD_FEES_EXPLANATION,
  PAUSE_PAYMENTS_EXPLANATION,
  PAUSE_TRANSFERS_EXPLANATION,
  TERMINAL_CONFIG_EXPLANATION,
  TERMINAL_MIGRATION_EXPLANATION,
  USE_DATASOURCE_FOR_REDEEM_EXPLANATION,
} from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/settingExplanations'
import {
  DEFAULT_BALLOT_STRATEGY,
  ballotStrategiesFn,
} from 'constants/v2v3/ballotStrategies'
import isEqual from 'lodash/isEqual'
import { BallotStrategy } from 'models/ballot'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAppDispatch } from 'redux/hooks/AppDispatch'
import { useAppSelector } from 'redux/hooks/AppSelector'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { getBallotStrategyByAddress } from 'utils/v2v3/ballotStrategies'
import TokenMintingExtra from './TokenMintingExtra'

export default function RulesForm({
  onFormUpdated,
  onFinish,
}: {
  onFormUpdated?: (updated: boolean) => void
  onFinish: VoidFunction
}) {
  const dispatch = useAppDispatch()
  const { fundingCycleMetadata, fundingCycleData } = useAppSelector(
    state => state.editingV2Project,
  )

  // Form initial values set by default
  const initialValues = useMemo(
    () => ({
      pausePay: fundingCycleMetadata.pausePay,
      allowMinting: fundingCycleMetadata.allowMinting,
      ballotStrategy: getBallotStrategyByAddress(
        fundingCycleData.ballot ?? DEFAULT_BALLOT_STRATEGY.address,
      ),
      allowSetTerminals: fundingCycleMetadata.global.allowSetTerminals,
      allowSetController: fundingCycleMetadata.global.allowSetController,
      allowTerminalMigration: fundingCycleMetadata.allowTerminalMigration,
      allowControllerMigration: fundingCycleMetadata.allowControllerMigration,
      pauseTransfers: fundingCycleMetadata.global.pauseTransfers,
      holdFees: fundingCycleMetadata.holdFees,
      useDataSourceForRedeem: fundingCycleMetadata.useDataSourceForRedeem,
    }),
    [fundingCycleData, fundingCycleMetadata],
  )

  const [showMintingWarning, setShowMintingWarning] = useState<boolean>(false)
  const [ballotStrategy, setBallotStrategy] = useState<BallotStrategy>(
    initialValues.ballotStrategy,
  )
  const [pausePay, setPausePay] = useState<boolean>(initialValues.pausePay)
  const [allowSetTerminals, setAllowSetTerminals] = useState<boolean>(
    initialValues.allowSetTerminals,
  )
  const [allowSetController, setAllowSetController] = useState<boolean>(
    initialValues.allowSetController,
  )
  const [allowTerminalMigration, setAllowTerminalMigration] = useState<boolean>(
    initialValues.allowTerminalMigration,
  )
  const [allowControllerMigration, setAllowControllerMigration] =
    useState<boolean>(initialValues.allowControllerMigration)
  const [pauseTransfers, setPauseTransfers] = useState<boolean | undefined>(
    initialValues.pauseTransfers,
  )
  const [allowMinting, setAllowMinting] = useState<boolean>(
    initialValues.allowMinting,
  )
  const [holdFees, setHoldFees] = useState<boolean>(initialValues.holdFees)
  const [useDataSourceForRedeem, setUseDataSourceForRedeem] = useState<boolean>(
    initialValues.useDataSourceForRedeem,
  )

  useEffect(() => {
    const hasFormUpdated =
      initialValues.allowMinting !== allowMinting ||
      initialValues.pausePay !== pausePay ||
      initialValues.allowSetTerminals !== allowSetTerminals ||
      initialValues.pauseTransfers !== pauseTransfers ||
      !isEqual(initialValues.ballotStrategy, ballotStrategy)

    onFormUpdated?.(hasFormUpdated)
  }, [
    onFormUpdated,
    initialValues,
    pausePay,
    allowMinting,
    ballotStrategy,
    allowSetTerminals,
    pauseTransfers,
  ])

  const onFormSaved = useCallback(() => {
    dispatch(editingV2ProjectActions.setPausePay(pausePay))
    dispatch(editingV2ProjectActions.setAllowMinting(allowMinting))
    dispatch(editingV2ProjectActions.setAllowSetTerminals(allowSetTerminals))
    dispatch(editingV2ProjectActions.setAllowSetController(allowSetController))
    dispatch(
      editingV2ProjectActions.setAllowTerminalMigration(allowTerminalMigration),
    )
    dispatch(
      editingV2ProjectActions.setAllowControllerMigration(
        allowControllerMigration,
      ),
    )
    dispatch(editingV2ProjectActions.setPauseTransfers(pauseTransfers ?? false))
    dispatch(editingV2ProjectActions.setBallot(ballotStrategy.address))
    dispatch(editingV2ProjectActions.setHoldFees(holdFees))
    dispatch(
      editingV2ProjectActions.setUseDataSourceForRedeem(useDataSourceForRedeem),
    )
    onFinish?.()
  }, [
    dispatch,
    pausePay,
    allowMinting,
    allowSetTerminals,
    allowSetController,
    allowTerminalMigration,
    allowControllerMigration,
    pauseTransfers,
    ballotStrategy.address,
    holdFees,
    useDataSourceForRedeem,
    onFinish,
  ])

  const disableSaveButton =
    !ballotStrategy || !isAddress(ballotStrategy.address)

  return (
    <Form layout="vertical" onFinish={onFormSaved}>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-5 rounded-sm bg-smoke-75 stroke-none p-8 shadow-[10px_10px_0px_0px_#E7E3DC] dark:bg-slate-400 dark:shadow-[10px_10px_0px_0px_#2D293A]">
          <div>
            <h3 className="text-black dark:text-slate-100">
              <Trans>Funding rules</Trans>
            </h3>
            <Form.Item extra={PAUSE_PAYMENTS_EXPLANATION}>
              <div className="flex font-medium text-black dark:text-slate-100">
                <Switch
                  className="mr-2"
                  onChange={setPausePay}
                  checked={pausePay}
                />
                <Trans>Pause payments to this project</Trans>
              </div>
            </Form.Item>
            <Form.Item name="holdfees" extra={HOLD_FEES_EXPLANATION}>
              <div className="flex font-medium text-black dark:text-slate-100">
                <Switch
                  className="mr-2"
                  onChange={checked => {
                    setHoldFees(checked)
                  }}
                  checked={holdFees}
                />
                <Trans>Hold fees</Trans>
              </div>
            </Form.Item>
          </div>

          <div>
            <h3 className="text-black dark:text-slate-100">
              <Trans>Token rules</Trans>
            </h3>{' '}
            <Form.Item
              extra={
                <TokenMintingExtra showMintingWarning={showMintingWarning} />
              }
            >
              <div className="flex font-medium text-black dark:text-slate-100">
                <Switch
                  className="mr-2"
                  onChange={checked => {
                    setShowMintingWarning(checked)
                    setAllowMinting(checked)
                  }}
                  checked={allowMinting}
                />
                <Trans>Allow owner token minting</Trans>
              </div>
            </Form.Item>
            <Form.Item extra={PAUSE_TRANSFERS_EXPLANATION}>
              <div className="flex font-medium text-black dark:text-slate-100">
                <Switch
                  className="mr-2"
                  onChange={checked => {
                    setPauseTransfers(checked)
                  }}
                  checked={pauseTransfers}
                />
                <Trans>Pause project token transfers</Trans>
              </div>
            </Form.Item>
          </div>

          <div>
            <h3 className="mb-5 text-black dark:text-slate-100">
              <Trans>Owner permissions</Trans>
            </h3>
            <h4 className="mb-3 font-heading text-lg font-normal text-black dark:text-slate-100">
              <Trans>Configuration rules</Trans>
            </h4>
            <Form.Item extra={TERMINAL_CONFIG_EXPLANATION}>
              <div className="flex font-medium text-black dark:text-slate-100">
                <Switch
                  className="mr-2"
                  onChange={checked => {
                    setAllowSetTerminals(checked)
                  }}
                  checked={allowSetTerminals}
                />
                <Trans>Allow Payment Terminal configuration</Trans>
              </div>
            </Form.Item>
            <Form.Item extra={CONTROLLER_CONFIG_EXPLANATION}>
              <div className="flex font-medium text-black dark:text-slate-100">
                <Switch
                  className="mr-2"
                  onChange={checked => {
                    setAllowSetController(checked)
                  }}
                  checked={allowSetController}
                />
                <Trans>Allow Controller configuration</Trans>
              </div>
            </Form.Item>

            <h4 className="mb-3 font-heading text-lg font-normal text-black dark:text-slate-100">
              <Trans>Migration rules</Trans>
            </h4>
            <Form.Item extra={TERMINAL_MIGRATION_EXPLANATION}>
              <div className="flex font-medium text-black dark:text-slate-100">
                <Switch
                  className="mr-2"
                  onChange={checked => {
                    setAllowTerminalMigration(checked)
                  }}
                  checked={allowTerminalMigration}
                />
                <Trans>Allow Payment Terminal migration</Trans>
              </div>
            </Form.Item>
            <Form.Item extra={CONTROLLER_MIGRATION_EXPLANATION}>
              <div className="flex font-medium text-black dark:text-slate-100">
                <Switch
                  className="mr-2"
                  onChange={checked => {
                    setAllowControllerMigration(checked)
                  }}
                  checked={allowControllerMigration}
                />
                <Trans>Allow Controller migration</Trans>
              </div>
            </Form.Item>
          </div>

          <div>
            <h3 className="text-black dark:text-slate-100">
              <Trans>NFT rules</Trans>
            </h3>
            <Form.Item
              name="useDataSourceForRedeem"
              extra={USE_DATASOURCE_FOR_REDEEM_EXPLANATION}
            >
              <div className="flex font-medium text-black dark:text-slate-100">
                <Switch
                  className="mr-2"
                  onChange={checked => {
                    setUseDataSourceForRedeem(checked)
                  }}
                  checked={useDataSourceForRedeem}
                />
                <Trans>Use NFTs for redemptions</Trans>
              </div>
            </Form.Item>
          </div>
        </div>

        <Form.Item
          className="rounded-sm bg-smoke-75 stroke-none p-8 shadow-[10px_10px_0px_0px_#E7E3DC] dark:bg-slate-400 dark:shadow-[10px_10px_0px_0px_#2D293A]"
          label={
            <FormItemLabel>
              <Trans>Edit deadline</Trans>
            </FormItemLabel>
          }
        >
          <ReconfigurationStrategySelector
            ballotStrategies={ballotStrategiesFn()}
            selectedStrategy={ballotStrategy}
            onChange={setBallotStrategy}
          />
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit" type="primary" disabled={disableSaveButton}>
            <Trans>Save rules</Trans>
          </Button>
        </Form.Item>
      </div>
    </Form>
  )
}
