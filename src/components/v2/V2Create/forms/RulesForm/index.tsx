import { Trans } from '@lingui/macro'
import { Button, Form, Space, Switch } from 'antd'
import { InfoCircleOutlined } from '@ant-design/icons'

import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { useCallback, useContext, useEffect, useState } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { ThemeContext } from 'contexts/themeContext'

import { isAddress } from '@ethersproject/address'

import ReconfigurationStrategySelector from 'components/shared/ReconfigurationStrategy/ReconfigurationStrategySelector'

import { BallotStrategy } from 'models/ballot'

import { shadowCard } from 'constants/styles/shadowCard'
import {
  ballotStrategies,
  DEFAULT_BALLOT_STRATEGY,
} from 'constants/v2/ballotStrategies'
import FormItemLabel from '../../FormItemLabel'

type RulesFormFields = {
  pausePay: boolean
  allowMinting: boolean
  ballot: string
}

export default function RulesForm({ onFinish }: { onFinish: VoidFunction }) {
  const { theme } = useContext(ThemeContext)

  const [form] = Form.useForm<RulesFormFields>()
  const dispatch = useAppDispatch()
  const { fundingCycleMetadata, fundingCycleData } = useAppSelector(
    state => state.editingV2Project,
  )

  const [showMintingWarning, setShowMintingWarning] = useState<boolean>(false)
  const [ballotStrategy, setBallotStrategy] = useState<BallotStrategy>(
    DEFAULT_BALLOT_STRATEGY,
  )

  const onFormSaved = useCallback(
    (fields: RulesFormFields) => {
      dispatch(editingV2ProjectActions.setPausePay(fields.pausePay))
      dispatch(editingV2ProjectActions.setAllowMinting(fields.allowMinting))
      dispatch(editingV2ProjectActions.setBallot(ballotStrategy.address))
      onFinish?.()
    },
    [dispatch, onFinish, ballotStrategy],
  )

  const resetForm = useCallback(() => {
    form.setFieldsValue({
      pausePay: fundingCycleMetadata?.pausePay,
      allowMinting: fundingCycleMetadata?.allowMinting,
      ballot: fundingCycleData?.ballot ?? DEFAULT_BALLOT_STRATEGY.address,
    })
    if (fundingCycleMetadata?.allowMinting) {
      setShowMintingWarning(true)
    }
  }, [fundingCycleData, fundingCycleMetadata, form])

  // initially fill form with any existing redux state
  useEffect(() => {
    resetForm()
  }, [resetForm])

  const switchContainerStyle = {
    display: 'flex',
    color: theme.colors.text.primary,
    fontWeight: 500,
  }

  const tokenMintingExtra = (
    <>
      <Trans>
        When enabled, the project owner can manually mint any amount of tokens
        to any address.
      </Trans>
      {showMintingWarning && (
        <div style={{ color: theme.colors.text.warn, marginTop: 10 }}>
          <InfoCircleOutlined />{' '}
          <Trans>
            Enabling token minting will appear risky to contributors. Only
            enable this when necessary.
          </Trans>
        </div>
      )}
    </>
  )

  const disableSaveButton =
    !ballotStrategy || !isAddress(ballotStrategy.address)

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={() => onFormSaved(form.getFieldsValue(true))}
    >
      <Space direction="vertical" size="large">
        <div style={{ ...shadowCard(theme), padding: '2rem' }}>
          <Form.Item
            name="pausePay"
            extra={
              <Trans>
                When enabled, your project cannot receive direct payments.
              </Trans>
            }
            valuePropName="checked"
          >
            <div
              style={{
                ...switchContainerStyle,
              }}
            >
              <Switch
                onChange={val => {
                  form.setFieldsValue({ pausePay: val })
                }}
                style={{ marginRight: '0.5rem' }}
              />
              <Trans>Pause payments</Trans>
            </div>
          </Form.Item>
          <Form.Item
            name="allowMinting"
            extra={tokenMintingExtra}
            valuePropName="checked"
          >
            <div
              style={{
                ...switchContainerStyle,
              }}
            >
              <Switch
                onChange={val => {
                  setShowMintingWarning(val)
                  form.setFieldsValue({ allowMinting: val })
                }}
                style={{ marginRight: '0.5rem' }}
              />
              <Trans>Allow token minting</Trans>
            </div>
          </Form.Item>
        </div>

        <Form.Item
          style={{ ...shadowCard(theme), padding: '2rem' }}
          label={
            <FormItemLabel>
              <Trans>Reconfiguration</Trans>
            </FormItemLabel>
          }
        >
          <ReconfigurationStrategySelector
            ballotStrategies={ballotStrategies()}
            selectedStrategy={ballotStrategy}
            onChange={(strategy: BallotStrategy) => {
              setBallotStrategy(strategy)
            }}
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
