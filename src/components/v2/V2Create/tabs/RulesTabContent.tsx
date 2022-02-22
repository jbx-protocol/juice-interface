import { t, Trans } from '@lingui/macro'
import { Button, Col, Form, Row, Switch } from 'antd'
import { useForm } from 'antd/lib/form/Form'

import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'

import { FormItems } from 'components/shared/formItems'
import { ThemeContext } from 'contexts/themeContext'

import { threeDayDelayStrategy } from 'constants/ballotStrategies/ballotStrategies'
import { shadowCard } from 'constants/styles/shadowCard'

type RulesFormFields = {
  pausePay: boolean
  pauseMint: boolean
  ballot: string
}

export default function RulesTabContent() {
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
      dispatch(editingV2ProjectActions.setPauseMint(fields.pauseMint))
      dispatch(editingV2ProjectActions.setBallot(fields.ballot))
    },
    [dispatch],
  )

  const resetForm = useCallback(() => {
    form.setFieldsValue({
      pausePay: fundingCycleMetadata?.pausePay ?? false,
      pauseMint: fundingCycleMetadata?.pauseMint ?? false,
      ballot: fundingCycleData?.ballot ?? threeDayDelayStrategy.address, // 3-day delay default
    })
  }, [
    fundingCycleMetadata?.pausePay,
    fundingCycleMetadata?.pauseMint,
    fundingCycleData?.ballot,
    form,
  ])

  // initially fill form with any existing redux state
  useEffect(() => {
    resetForm()
  }, [resetForm])

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
    <Row gutter={32}>
      <Col span={12}>
        <Form form={form} layout="vertical" onFinish={onFormSaved}>
          <Form.Item
            name="pausePay"
            label={t`Pause payments`}
            extra={t`When Pause Payments is enabled, your project cannot receive direct payments.`}
            valuePropName="checked"
            style={{ ...shadowCard(theme), padding: '2rem' }}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="pauseMint"
            label={t`Allow minting tokens`}
            extra={tokenMintingExtra}
            valuePropName="checked"
            style={{ ...shadowCard(theme), padding: '2rem' }}
          >
            <Switch
              onChange={val => {
                setShowMintingWarning(val)
              }}
            />
          </Form.Item>
          <FormItems.ProjectReconfiguration
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
        </Form>
      </Col>
      <Col span={12}></Col>
    </Row>
  )
}
