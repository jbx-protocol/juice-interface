import { t, Trans } from '@lingui/macro'
import { Button, Form, Space, Switch } from 'antd'
import { useForm } from 'antd/lib/form/Form'

import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'

import { FormItems } from 'components/shared/formItems'
import { ThemeContext } from 'contexts/themeContext'

import { ballotStrategies } from 'constants/ballotStrategies/ballotStrategies'
import { shadowCard } from 'constants/styles/shadowCard'

export type OthersFormFields = {
  pausePay: boolean
  pauseMint: boolean
  ballot: string
}

export default function OthersTabContent() {
  const { theme } = useContext(ThemeContext)

  const [othersForm] = useForm<OthersFormFields>()
  const dispatch = useAppDispatch()
  const { fundingCycleMetadata, fundingCycleData } = useAppSelector(
    state => state.editingV2Project,
  )

  const [showMintingWarning, setShowMintingWarning] = useState<boolean>(false)

  const onOthersFormSaved = useCallback(() => {
    const fields = othersForm.getFieldsValue(true)
    dispatch(editingV2ProjectActions.setPausePay(fields.pausePay))
    dispatch(editingV2ProjectActions.setPauseMint(fields.pauseMint))
    dispatch(editingV2ProjectActions.setBallot(fields.ballot))
  }, [dispatch, othersForm])

  const resetOthersForm = useCallback(() => {
    othersForm.setFieldsValue({
      pausePay: fundingCycleMetadata?.pausePay ?? false,
      pauseMint: fundingCycleMetadata?.pauseMint ?? false,
      ballot: fundingCycleData?.ballot ?? ballotStrategies()[2].address, // 3-day delay default
    })
  }, [
    fundingCycleMetadata?.pausePay,
    fundingCycleMetadata?.pauseMint,
    fundingCycleData?.ballot,
    othersForm,
  ])

  // initially fill form with any existing redux state
  useEffect(() => {
    resetOthersForm()
  }, [resetOthersForm])

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
    <div>
      <Space direction="vertical" size="large">
        <p>
          <Trans>
            <strong>Note: </strong>Once your first funding cycle starts, updates
            you make to attributes in this section will{' '}
            <i>not be applied immediately</i> and only take effect in{' '}
            <i>upcoming funding cycles.</i>
          </Trans>
        </p>
        <Form form={othersForm} layout="vertical" onFinish={onOthersFormSaved}>
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
            value={
              othersForm.getFieldValue('ballot') ?? fundingCycleData?.ballot
            }
            onChange={(address: string) =>
              othersForm.setFieldsValue({ ballot: address })
            }
            style={{ ...shadowCard(theme), padding: '2rem' }}
          />
          <Form.Item>
            <Button htmlType="submit" type="primary">
              <Trans>Save project details</Trans>
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </div>
  )
}
