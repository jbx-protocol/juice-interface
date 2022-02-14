/* eslint-disable */
import { t, Trans } from '@lingui/macro'
import { Select, Space, Form, InputNumber, Button } from 'antd'
import { useForm } from 'antd/lib/form/Form'

// import { useAppDispatch } from 'hooks/AppDispatch'
// import { useAppSelector } from 'hooks/AppSelector'
import { useCallback, useContext, useEffect, useState } from 'react'

// import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { ThemeContext } from 'contexts/themeContext'

import { helpPagePath } from 'utils/helpPageHelper'

import { shadowCard } from 'constants/styles/shadowCard'
import ProjectTarget from 'components/shared/formItems/ProjectTarget'
import { CURRENCY_ETH } from 'constants/currency'
import { BigNumber } from 'ethers'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { format } from 'path'
import BudgetTargetInput from 'components/shared/inputs/BudgetTargetInput'
const { Option } = Select

type FundingFormFields = {
  target?: number
  duration?: number
}

export default function ProjectDetailsTabContent() {
  const [fundingForm] = useForm<FundingFormFields>()
  const [isFundingTargetSectionVisible, setFundingTargetSectionVisible] =
    useState<boolean>()
  const [isFundingDurationVisible, setFundingDurationVisible] =
    useState<boolean>()
  const { theme } = useContext(ThemeContext)
  // const dispatch = useAppDispatch()
  // const { info: editingV2ProjectInfo } = useAppSelector(
  //   state => state.editingV2Project,
  // )

  const onFundingFormSave = useCallback(values => {
    // TODO dispatch things
    console.log(values, fundingForm.getFieldsValue())
  }, [])

  const resetProjectForm = useCallback(() => {
    // reset form fields
  }, [])

  // initially fill form with any existing redux state
  useEffect(() => {
    resetProjectForm()
  }, [resetProjectForm])

  const onFundingTypeChange = useCallback(value => {
    setFundingTargetSectionVisible(['target', 'recurring'].includes(value))
    setFundingDurationVisible(value === 'recurring')
  }, [])

  return (
    <div>
      <Space direction="vertical" size="large">
        <Form form={fundingForm} layout="vertical" onFinish={onFundingFormSave}>
          <Form.Item label={t`How much do you want to raise?`}>
            <Select onChange={onFundingTypeChange}>
              <Option value="target">
                <Trans>Specific target</Trans>
              </Option>
              <Option value="no_target">
                <Trans>No target (as much as possible)</Trans>
              </Option>
              <Option value="recurring">
                <Trans>Recurring target</Trans>
              </Option>
            </Select>
          </Form.Item>

          {isFundingTargetSectionVisible ? (
            <div
              style={{
                padding: '1rem',
                marginBottom: '1rem',
                ...shadowCard(theme),
              }}
            >
              <h3>Funding target</h3>
              <p>
                <Trans>
                  Set the amount of funds you'd like to raise each funding
                  cycle. Any funds raised within the funding cycle target can be
                  distributed by the project, and can't be redeemed by your
                  project's token holders.
                </Trans>
              </p>
              <p>
                <Trans>
                  Overflow is created if your project's balance exceeds your
                  funding cycle target. Overflow can be redeemed by your
                  project's token holders.
                </Trans>{' '}
                <Trans>
                  <a
                    href={helpPagePath('protocol/learn/topics/overflow')}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Learn more
                  </a>{' '}
                  about overflow.
                </Trans>
              </p>

              {isFundingDurationVisible && (
                <Form.Item
                  name={'duration'}
                  label={t`Funding cycle duration`}
                  required
                >
                  <FormattedNumberInput
                    placeholder="30"
                    suffix="days"
                    min={1}
                  />
                </Form.Item>
              )}

              <Form.Item name={'target'} label={t`Funding target`} required>
                <BudgetTargetInput
                  target={fundingForm.getFieldValue('target')}
                  targetSubFee={'1000'}
                  currency={CURRENCY_ETH}
                  onTargetSubFeeChange={() => {}}
                  onCurrencyChange={() => {}}
                  placeholder="0"
                  fee={BigNumber.from('5')}
                />
              </Form.Item>
            </div>
          ) : (
            <p>
              <Trans>
                All funds can be distributed by the project. The project will
                have no overflow (the same as setting the target to infinity).
              </Trans>
            </p>
          )}

          <Form.Item>
            <Button htmlType="submit" type="primary">
              <Trans>Save funding details</Trans>
            </Button>
          </Form.Item>
        </Form>
      </Space>
    </div>
  )
}
