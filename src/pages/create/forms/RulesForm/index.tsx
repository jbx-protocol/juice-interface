import { Trans } from '@lingui/macro'
import { Button, Form, Space, Switch } from 'antd'

import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { ThemeContext } from 'contexts/themeContext'

import { isAddress } from '@ethersproject/address'

import ReconfigurationStrategySelector from 'components/ReconfigurationStrategy/ReconfigurationStrategySelector'

import { BallotStrategy } from 'models/ballot'

import isEqual from 'lodash/isEqual'

import { shadowCard } from 'constants/styles/shadowCard'
import {
  ballotStrategies,
  DEFAULT_BALLOT_STRATEGY,
} from 'constants/v2/ballotStrategies'
import FormItemLabel from '../../FormItemLabel'
import { getBallotStrategyByAddress } from 'constants/v2/ballotStrategies/getBallotStrategiesByAddress'
import TokenMintingExtra from './TokenMintingExtra'

export default function RulesForm({
  onFormUpdated,
  onFinish,
}: {
  onFormUpdated?: (updated: boolean) => void
  onFinish: VoidFunction
}) {
  const { theme } = useContext(ThemeContext)

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
  const [allowMinting, setAllowMinting] = useState<boolean>(
    initialValues.allowMinting,
  )

  useEffect(() => {
    const hasFormUpdated =
      initialValues.allowMinting !== allowMinting ||
      initialValues.pausePay !== pausePay ||
      initialValues.allowSetTerminals !== allowSetTerminals ||
      !isEqual(initialValues.ballotStrategy, ballotStrategy)

    onFormUpdated?.(hasFormUpdated)
  }, [
    onFormUpdated,
    initialValues,
    pausePay,
    allowMinting,
    ballotStrategy,
    allowSetTerminals,
  ])

  const onFormSaved = useCallback(() => {
    dispatch(editingV2ProjectActions.setPausePay(pausePay))
    dispatch(editingV2ProjectActions.setAllowMinting(allowMinting))
    dispatch(editingV2ProjectActions.setAllowSetTerminals(allowSetTerminals))
    dispatch(editingV2ProjectActions.setBallot(ballotStrategy.address))
    onFinish?.()
  }, [
    dispatch,
    onFinish,
    ballotStrategy,
    pausePay,
    allowMinting,
    allowSetTerminals,
  ])

  const switchContainerStyle = {
    display: 'flex',
    color: theme.colors.text.primary,
    fontWeight: 500,
  }

  const disableSaveButton =
    !ballotStrategy || !isAddress(ballotStrategy.address)

  return (
    <Form layout="vertical" onFinish={onFormSaved}>
      <Space direction="vertical" size="large">
        <div style={{ ...shadowCard(theme), padding: '2rem' }}>
          <Form.Item
            extra={
              <Trans>
                When enabled, your project cannot receive direct payments.
              </Trans>
            }
          >
            <div
              style={{
                ...switchContainerStyle,
              }}
            >
              <Switch
                onChange={setPausePay}
                style={{ marginRight: '0.5rem' }}
                checked={pausePay}
              />
              <Trans>Pause payments</Trans>
            </div>
          </Form.Item>
          <Form.Item
            extra={
              <TokenMintingExtra showMintingWarning={showMintingWarning} />
            }
          >
            <div
              style={{
                ...switchContainerStyle,
              }}
            >
              <Switch
                onChange={checked => {
                  setShowMintingWarning(checked)
                  setAllowMinting(checked)
                }}
                style={{ marginRight: '0.5rem' }}
                checked={allowMinting}
              />
              <Trans>Allow token minting</Trans>
            </div>
          </Form.Item>

          <Form.Item
            extra={
              <Trans>
                When enabled, the project owner can set the project's payment
                terminals.
              </Trans>
            }
          >
            <div
              style={{
                ...switchContainerStyle,
              }}
            >
              <Switch
                onChange={checked => {
                  setAllowSetTerminals(checked)
                }}
                style={{ marginRight: '0.5rem' }}
                checked={allowSetTerminals}
              />
              <Trans>Allow terminal configuration</Trans>
            </div>
          </Form.Item>
        </div>

        <Form.Item
          style={{ ...shadowCard(theme), padding: '2rem' }}
          label={
            <FormItemLabel>
              <Trans>Reconfiguration rules</Trans>
            </FormItemLabel>
          }
        >
          <ReconfigurationStrategySelector
            ballotStrategies={ballotStrategies()}
            selectedStrategy={ballotStrategy}
            onChange={setBallotStrategy}
          />
        </Form.Item>

        <Form.Item>
          <Button htmlType="submit" type="primary" disabled={disableSaveButton}>
            <Trans>Save rules</Trans>
          </Button>
        </Form.Item>
      </Space>
    </Form>
  )
}
