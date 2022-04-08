import { Trans } from '@lingui/macro'
import { Button, Form, Space, Switch } from 'antd'
import { useForm } from 'antd/lib/form/Form'

import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { ThemeContext } from 'contexts/themeContext'

import { shadowCard } from 'constants/styles/shadowCard'
import { DEFAULT_BALLOT_STRATEGY } from 'constants/ballotStrategies/ballotStrategies'
import ProjectReconfigurationFormItem from './ProjectReconfigurationFormItem'

type RulesFormFields = {
  pausePay: boolean
  allowMint: boolean
  ballot: string
}

export default function RulesForm({ onFinish }: { onFinish: VoidFunction }) {
  const { theme } = useContext(ThemeContext)

  const [form] = useForm<RulesFormFields>()
  const dispatch = useAppDispatch()
  const { fundingCycleMetadata, fundingCycleData } = useAppSelector(
    state => state.editingV2Project,
  )

  const [showMintingWarning, setShowMintingWarning] = useState<boolean>(false)

  const onFormSaved = useCallback(
    (fields: RulesFormFields) => {
      dispatch(editingV2ProjectActions.setPausePay(fields.pausePay))
      dispatch(editingV2ProjectActions.setPauseMint(!fields.allowMint))
      dispatch(editingV2ProjectActions.setBallot(fields.ballot))
      onFinish?.()
    },
    [dispatch, onFinish],
  )

  const resetForm = useCallback(() => {
    form.setFieldsValue({
      pausePay: fundingCycleMetadata?.pausePay,
      allowMint: !fundingCycleMetadata?.pauseMint,
      ballot: fundingCycleData?.ballot ?? DEFAULT_BALLOT_STRATEGY.address,
    })
    if (fundingCycleMetadata?.pauseMint) {
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
    <React.Fragment>
      <Trans>
        When Minting Tokens is enabled, the project owner can manually mint any
        amount of tokens to any address.
      </Trans>
      {showMintingWarning && (
        <div style={{ color: theme.colors.text.warn, marginTop: 10 }}>
          <Trans>
            <strong>Note: </strong>Enabling tokens to be minted will appear
            risky to contributors, and should only be used when necessary.
          </Trans>
        </div>
      )}
    </React.Fragment>
  )
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
                When Pause Payments is enabled, your project cannot receive
                direct payments.
              </Trans>
            }
            valuePropName="checked"
          >
            <div
              style={{
                ...switchContainerStyle,
              }}
            >
              <Switch style={{ marginRight: '0.5rem' }} />
              <Trans>Pause payments</Trans>
            </div>
          </Form.Item>
          <Form.Item
            name="allowMint"
            extra={tokenMintingExtra}
            valuePropName="checked"
          >
            <div
              style={{
                ...switchContainerStyle,
              }}
            >
              <Switch
                onChange={val => setShowMintingWarning(val)}
                style={{ marginRight: '0.5rem' }}
              />
              <Trans>Allow token minting</Trans>
            </div>
          </Form.Item>
        </div>

        <ProjectReconfigurationFormItem
          value={form.getFieldValue('ballot') ?? fundingCycleData?.ballot}
          onChange={(address: string) =>
            form.setFieldsValue({ ballot: address })
          }
          style={{ ...shadowCard(theme), padding: '2rem' }}
        />

        <Form.Item>
          <Button htmlType="submit" type="primary">
            <Trans>Save rules</Trans>
          </Button>
        </Form.Item>
      </Space>
    </Form>
  )
}
