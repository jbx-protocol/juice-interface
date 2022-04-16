import { Trans } from '@lingui/macro'
import { Button, Form, Space } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import ReservedTokensFormItem from 'components/v2/V2Create/forms/TokenForm/ReservedTokensFormItem'

import { useCallback, useContext, useState } from 'react'
import {
  defaultFundingCycleData,
  defaultFundingCycleMetadata,
  editingV2ProjectActions,
} from 'redux/slices/editingV2Project'

import { sanitizeSplit } from 'utils/v2/splits'

import { Split } from 'models/v2/splits'

import {
  discountRateFrom,
  formatDiscountRate,
  formatRedemptionRate,
  formatReservedRate,
  redemptionRateFrom,
  reservedRateFrom,
} from 'utils/v2/math'

import { BigNumber } from '@ethersproject/bignumber'

import { FormItems } from 'components/shared/formItems'

import {
  getDefaultFundAccessConstraint,
  hasDistributionLimit,
  hasFundingDuration,
} from 'utils/v2/fundingCycle'

import { SerializedV2FundAccessConstraint } from 'utils/v2/serializers'

import { shadowCard } from 'constants/styles/shadowCard'
import TabDescription from '../../TabDescription'

type TokenFormFields = {
  discountRate: string
  reservedRate: string
  redemptionRate: string
}

export default function TokenForm({ onFinish }: { onFinish: VoidFunction }) {
  const { theme } = useContext(ThemeContext)

  const dispatch = useAppDispatch()
  const {
    fundingCycleMetadata,
    fundingCycleData,
    reservedTokensGroupedSplits,
    fundAccessConstraints,
  } = useAppSelector(state => state.editingV2Project)

  const fundAccessConstraint =
    getDefaultFundAccessConstraint<SerializedV2FundAccessConstraint>(
      fundAccessConstraints,
    )

  const [reservedTokensSplits, setReservedTokensSplits] = useState<Split[]>(
    reservedTokensGroupedSplits?.splits,
  )

  /**
   * NOTE: values in the form should be in their 'native' units,
   * e.g. permyriads, parts-per-billion etc.
   * and NOT percentages.
   *
   */
  const [tokenForm] = Form.useForm<TokenFormFields>()

  const onTokenFormSaved = useCallback(() => {
    const fields = tokenForm.getFieldsValue(true)
    const newReservedTokensSplits = reservedTokensSplits.map(split =>
      sanitizeSplit(split),
    )
    /**
     * NOTE: all values dispatched to Redux should be in their 'native' units,
     * e.g. permyriads, parts-per-billion etc.
     * and NOT percentages.
     */
    dispatch(
      editingV2ProjectActions.setDiscountRate(fields.discountRate ?? '0'),
    )
    dispatch(
      editingV2ProjectActions.setReservedRate(fields.reservedRate ?? '0'),
    )
    dispatch(editingV2ProjectActions.setRedemptionRate(fields.redemptionRate))
    dispatch(
      editingV2ProjectActions.setReservedTokensSplits(newReservedTokensSplits),
    )

    onFinish?.()
  }, [dispatch, reservedTokensSplits, onFinish, tokenForm])

  const canSetRedemptionRate = hasDistributionLimit(fundAccessConstraint)
  const canSetDiscountRate = hasFundingDuration(fundingCycleData)

  /**
   * NOTE: these values will all be in their 'native' units,
   * e.g. permyriads, parts-per-billion etc.
   *
   * We will convert these to percentages to pass as
   * props later on.
   */
  const initialValues = {
    reservedRate:
      fundingCycleMetadata?.reservedRate ??
      defaultFundingCycleMetadata.reservedRate,
    discountRate:
      (canSetDiscountRate && fundingCycleData?.discountRate) ||
      defaultFundingCycleData.discountRate,
    redemptionRate:
      (canSetRedemptionRate && fundingCycleMetadata?.redemptionRate) ||
      defaultFundingCycleMetadata.redemptionRate,
  }

  return (
    <Form
      form={tokenForm}
      initialValues={initialValues}
      layout="vertical"
      onFinish={onTokenFormSaved}
    >
      <Space size="middle" direction="vertical">
        <TabDescription>
          <Trans>
            By default, the issuance rate for your project's token is 1,000,000
            tokens / 1 ETH. For example, a 1 ETH contribution to your project
            will return 1,000,000 tokens. You can manipulate the issuance rate
            with the following configurations.
          </Trans>
        </TabDescription>

        <div>
          <ReservedTokensFormItem
            initialValue={parseFloat(
              formatReservedRate(BigNumber.from(initialValues.reservedRate)),
            )}
            onChange={newReservedRatePercentage => {
              tokenForm.setFieldsValue({
                reservedRate: reservedRateFrom(
                  newReservedRatePercentage?.toString() ?? '0',
                ).toString(),
              })
            }}
            style={{ ...shadowCard(theme), padding: 25, marginBottom: 10 }}
            reservedTokensSplits={reservedTokensSplits}
            onReservedTokensSplitsChange={setReservedTokensSplits}
          />

          <FormItems.ProjectDiscountRate
            value={formatDiscountRate(
              BigNumber.from(initialValues.discountRate),
            )}
            onChange={newDiscountRatePercentage => {
              tokenForm.setFieldsValue({
                discountRate: discountRateFrom(
                  newDiscountRatePercentage?.toString() ?? '0',
                ).toString(),
              })
            }}
            style={{ ...shadowCard(theme), padding: 25, marginBottom: 10 }}
            disabled={!canSetDiscountRate}
          />

          <FormItems.ProjectBondingCurveRate
            label={<Trans>Redemption rate</Trans>}
            value={formatRedemptionRate(
              BigNumber.from(initialValues.redemptionRate),
            )}
            onChange={newRedemptionRatePercentage =>
              tokenForm.setFieldsValue({
                redemptionRate: redemptionRateFrom(
                  newRedemptionRatePercentage?.toString() ?? '0',
                ).toString(),
              })
            }
            style={{ ...shadowCard(theme), padding: 25, marginBottom: 10 }}
            disabled={!canSetRedemptionRate}
          />
        </div>

        <Form.Item>
          <Button htmlType="submit" type="primary">
            <Trans>Save token configuration</Trans>
          </Button>
        </Form.Item>
      </Space>
    </Form>
  )
}
