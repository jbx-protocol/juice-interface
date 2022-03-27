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
import { TabContentProps } from '../../models'
import ProjectConfigurationFieldsContainer from '../ProjectConfigurationFieldsContainer'

type RulesFormFields = {
  pausePay: boolean
  allowMint: boolean
  ballot: string
}

export default function RulesTabContent({
  onFinish,
  hidePreview,
  saveButton,
}: TabContentProps) {
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
      <ProjectConfigurationFieldsContainer hidePreview={hidePreview}>
        <Form
          form={form}
          layout="vertical"
          onFinish={() => onFormSaved(form.getFieldsValue(true))}
          style={{ marginBottom: formBottomMargin }}
        >
          <Form.Item
            name="pausePay"
            label={
              <FormItemLabel style={{ marginBottom: 0 }}>
                <Trans>Pause payments</Trans>
              </FormItemLabel>
            }
            extra={t`When Pause Payments is enabled, your project cannot receive direct payments.`}
            valuePropName="checked"
            style={{ ...shadowCard(theme), padding: '2rem' }}
          >
            <Switch />
          </Form.Item>
          <Form.Item
            name="allowMint"
            label={
              <FormItemLabel style={{ marginBottom: 0 }}>
                <Trans>Allow token minting</Trans>
              </FormItemLabel>
            }
            extra={tokenMintingExtra}
            valuePropName="checked"
            style={{ ...shadowCard(theme), padding: '2rem' }}
          >
            <Switch onChange={val => setShowMintingWarning(val)} />
          </Form.Item>
          <ProjectReconfigurationFormItem
            value={form.getFieldValue('ballot') ?? fundingCycleData?.ballot}
            onChange={(address: string) =>
              form.setFieldsValue({ ballot: address })
            }
            style={{ ...shadowCard(theme), padding: '2rem' }}
          />

          {/* Default to floating save button if custom one not given */}
          {saveButton ?? <FormActionbar isLastTab />}
        </Form>
      </ProjectConfigurationFieldsContainer>
      {!hidePreview && <Col md={12} xs={0}></Col>}
    </Row>
  )
}
