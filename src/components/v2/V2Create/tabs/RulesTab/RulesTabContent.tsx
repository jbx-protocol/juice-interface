import { t, Trans } from '@lingui/macro'
import { Col, Form, Row, Switch } from 'antd'
import { useForm } from 'antd/lib/form/Form'

import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { ThemeContext } from 'contexts/themeContext'

import { shadowCard } from 'constants/styles/shadowCard'
import { DEFAULT_BALLOT_STRATEGY } from 'constants/ballotStrategies/ballotStrategies'
import FormActionbar from '../../FormActionBar'
import { formBottomMargin } from '../../constants'
import ProjectReconfigurationFormItem from './ProjectReconfigurationFormItem'
import FormItemLabel from '../../FormItemLabel'

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
      ballot: fundingCycleData?.ballot ?? DEFAULT_BALLOT_STRATEGY.address,
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
      <Col md={12} xs={24}>
        <Form
          form={form}
          layout="vertical"
          onFinish={() => onFormSaved(form.getFieldsValue(true))}
          style={{ marginBottom: formBottomMargin }}
        >
          <Form.Item
            name="pausePay"
            extra={t`When Pause Payments is enabled, your project cannot receive direct payments.`}
            valuePropName="checked"
            style={{ ...shadowCard(theme), padding: '2rem' }}
          >
            <div style={{ display: 'flex' }}>
              <FormItemLabel>
                <Trans>Pause payments</Trans>
              </FormItemLabel>
              <Switch
                onChange={val => form.setFieldsValue({ pausePay: val })}
              />
            </div>
          </Form.Item>
          <Form.Item
            name="pauseMint"
            extra={tokenMintingExtra}
            valuePropName="checked"
            style={{ ...shadowCard(theme), padding: '2rem' }}
          >
            <div style={{ display: 'flex' }}>
              <FormItemLabel>
                <Trans>Allow token minting</Trans>
              </FormItemLabel>
              <Switch
                onChange={val => {
                  form.setFieldsValue({ pauseMint: val })
                  setShowMintingWarning(val)
                }}
              />
            </div>
          </Form.Item>
          <ProjectReconfigurationFormItem
            value={form.getFieldValue('ballot') ?? fundingCycleData?.ballot}
            onChange={(address: string) =>
              form.setFieldsValue({ ballot: address })
            }
            style={{ ...shadowCard(theme), padding: '2rem' }}
          />

          <FormActionbar isLastTab />
        </Form>
      </Col>
      <Col md={12} xs={0}></Col>
    </Row>
  )
}
