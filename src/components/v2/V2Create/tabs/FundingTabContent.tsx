import { t, Trans } from '@lingui/macro'
import { Select, Space, Form, Button } from 'antd'
import { useForm } from 'antd/lib/form/Form'

// import { useAppDispatch } from 'hooks/AppDispatch'
// import { useAppSelector } from 'hooks/AppSelector'
import { useCallback, useContext, useEffect, useState } from 'react'

// import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { ThemeContext } from 'contexts/themeContext'

import { helpPagePath } from 'utils/helpPageHelper'

import { BigNumber } from 'ethers'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'

import BudgetTargetInput from 'components/shared/inputs/BudgetTargetInput'
import ProjectPayoutMods from 'components/shared/formItems/ProjectPayoutMods'

import { CURRENCY_ETH } from 'constants/currency'
import { shadowCard } from 'constants/styles/shadowCard'
const { Option } = Select

type JBSplit = {
  beneficiary?: string // address
  percent: number
  preferClaimed?: boolean
  lockedUntil?: number
  projectId?: BigNumber
  allocator?: string
}

type FundingFormFields = {
  target?: number
  duration?: number
  splits?: JBSplit[]
}

export default function ProjectDetailsTabContent() {
  const [fundingForm] = useForm<FundingFormFields>()
  const [splits, setSplits] = useState<JBSplit[]>([])
  const [, setTarget] = useState<number>()
  const [isFundingTargetSectionVisible, setFundingTargetSectionVisible] =
    useState<boolean>()
  const [isFundingDurationVisible, setFundingDurationVisible] =
    useState<boolean>()
  const { theme } = useContext(ThemeContext)
  // const dispatch = useAppDispatch()
  // const { info: editingV2ProjectInfo } = useAppSelector(
  //   state => state.editingV2Project,
  // )

  const onFundingFormSave = useCallback(
    values => {
      // TODO dispatch things
      console.log(values, { ...fundingForm.getFieldsValue(), splits })
    },
    [splits, fundingForm],
  )

  const resetProjectForm = useCallback(() => {
    fundingForm.setFieldsValue({
      splits: [],
      target: 0,
      duration: 0,
    })
  }, [fundingForm])

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
                marginBottom: '10px',
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
                  onChange={val => setTarget(parseInt(val ?? '0', 10))}
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

          <div
            style={{
              padding: '1rem',
              marginBottom: '1rem',
              ...shadowCard(theme),
            }}
          >
            <h3>Payouts</h3>
            <ProjectPayoutMods
              mods={splits}
              target={'10000'}
              currency={CURRENCY_ETH}
              onModsChanged={newMods => {
                setSplits(
                  newMods.map((split): JBSplit => {
                    const {
                      beneficiary,
                      percent,
                      preferUnstaked,
                      lockedUntil,
                      projectId,
                      allocator,
                    } = split

                    return {
                      beneficiary,
                      percent,
                      preferClaimed: preferUnstaked,
                      lockedUntil,
                      projectId,
                      allocator,
                    }
                  }),
                )
              }}
              fee={BigNumber.from('5')}
            />
          </div>

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
