import { t, Trans } from '@lingui/macro'
import { Button, Form } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'
import { ThemeContext } from 'contexts/themeContext'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import ReservedTokensFormItem from 'components/v2/V2Create/forms/TokenForm/ReservedTokensFormItem'

import { useCallback, useContext, useEffect, useState } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { SerializedV2FundAccessConstraint } from 'utils/v2/serializers'
import {
  getDefaultFundAccessConstraint,
  hasFundingDuration,
  hasFundingTarget,
} from 'utils/v2/fundingCycle'

import { sanitizeSplit } from 'utils/v2/splits'

import { Split } from 'models/v2/splits'

import { shadowCard } from 'constants/styles/shadowCard'
import TabDescription from '../../TabDescription'

type TokenFormFields = {
  discountRate: string
  reservedRate: string
  redemptionRate: string
}

export default function TokenForm({ onFinish }: { onFinish: VoidFunction }) {
  const [tokenForm] = useForm<TokenFormFields>()
  const { theme } = useContext(ThemeContext)

  const {
    fundingCycleMetadata,
    fundingCycleData,
    fundAccessConstraints,
    reservedTokensGroupedSplits: reduxReservedTokensGroupedSplits,
  } = useAppSelector(state => state.editingV2Project)

  const reduxDiscountRate = fundingCycleData?.discountRate
  const reduxReservedRate = fundingCycleMetadata?.reservedRate
  const reduxRedemptionRate = fundingCycleMetadata?.redemptionRate

  // Assume the first item is the one of interest.
  const fundAccessConstraint =
    getDefaultFundAccessConstraint<SerializedV2FundAccessConstraint>(
      fundAccessConstraints,
    )

  const [reservedTokensSplits, setReservedTokensSplits] = useState<Split[]>(
    reduxReservedTokensGroupedSplits?.splits ?? [],
  )

  const [discountRateDisabled, setDiscountRateDisabled] = useState<boolean>(
    reduxDiscountRate === undefined ||
      reduxDiscountRate === '0' ||
      !hasFundingDuration(fundingCycleData),
  )

  const [reservedRateDisabled, setReservedRateDisabled] = useState<boolean>(
    reduxReservedRate === undefined || reduxReservedRate === '0',
  )

  const [redemptionRateDisabled, setRedemptionRateDisabled] = useState<boolean>(
    reduxRedemptionRate === undefined ||
      reduxRedemptionRate === '100' ||
      !hasFundingTarget(fundAccessConstraint),
  )
  const dispatch = useAppDispatch()

  const onTokenFormSaved = useCallback(
    (fields: TokenFormFields) => {
      const newReservedTokensSplits = reservedTokensSplits.map(split =>
        sanitizeSplit(split),
      )

      dispatch(editingV2ProjectActions.setDiscountRate(fields.discountRate))
      dispatch(editingV2ProjectActions.setReservedRate(fields.reservedRate))
      dispatch(editingV2ProjectActions.setRedemptionRate(fields.redemptionRate))
      dispatch(
        editingV2ProjectActions.setReservedTokensSplits(
          newReservedTokensSplits,
        ),
      )

      onFinish?.()
    },
    [dispatch, reservedTokensSplits, onFinish],
  )

  const resetTokenForm = useCallback(() => {
    // Check form value first in case form has been updated before new redux state saved
    tokenForm.setFieldsValue({
      discountRate:
        tokenForm.getFieldValue('discountRate') ?? reduxDiscountRate ?? '0',
      reservedRate:
        tokenForm.getFieldValue('reservedRate') ?? reduxReservedRate ?? '0',
      redemptionRate:
        tokenForm.getFieldValue('redemptionRate') ??
        reduxRedemptionRate ??
        '100',
    })
    setReservedTokensSplits(reservedTokensSplits)
  }, [
    reduxDiscountRate,
    reduxReservedRate,
    reduxRedemptionRate,
    reservedTokensSplits,
    tokenForm,
  ])

  // initially fill form with any existing redux state
  useEffect(() => {
    resetTokenForm()
  }, [resetTokenForm])

  return (
    <Form
      form={tokenForm}
      layout="vertical"
      onFinish={() => onTokenFormSaved(tokenForm.getFieldsValue(true))}
    >
      <TabDescription>
        <Trans>
          By default, the issuance rate for your project's token is 1,000,000
          tokens / 1 ETH. For example, 1 ETH contribution to your project will
          return 1,000,000 tokens. You can manipulate the issuance rate with the
          following configurations.
        </Trans>
      </TabDescription>

      <ReservedTokensFormItem
        value={tokenForm.getFieldValue('reservedRate') ?? reduxReservedRate}
        onChange={val => {
          tokenForm.setFieldsValue({ reservedRate: val?.toString() })
        }}
        style={{ ...shadowCard(theme), padding: 25 }}
        disabled={reservedRateDisabled}
        toggleDisabled={(checked: boolean) => {
          if (!checked) {
            tokenForm.setFieldsValue({ reservedRate: '0' })
          } else {
            tokenForm.setFieldsValue({ reservedRate: '50' })
          }
          setReservedRateDisabled(!checked)
        }}
        reservedTokensSplits={reservedTokensSplits}
        onReservedTokensSplitsChange={setReservedTokensSplits}
      />
      <br />
      <FormItems.ProjectDiscountRate
        value={tokenForm.getFieldValue('discountRate') ?? reduxDiscountRate} // use redux if form hasn't loaded yet
        name="discountRate"
        onChange={val => {
          tokenForm.setFieldsValue({ discountRate: val?.toString() })
        }}
        style={{ ...shadowCard(theme), padding: 25 }}
        disabled={discountRateDisabled}
        toggleDisabled={
          hasFundingDuration(fundingCycleData)
            ? (checked: boolean) => {
                tokenForm.setFieldsValue({
                  discountRate: !checked ? '0' : '10',
                })
                setDiscountRateDisabled(!checked)
              }
            : undefined
        }
      />
      <br />
      <FormItems.ProjectBondingCurveRate
        value={tokenForm.getFieldValue('redemptionRate') ?? reduxRedemptionRate}
        onChange={(val?: number) =>
          tokenForm.setFieldsValue({ redemptionRate: val?.toString() })
        }
        style={{ ...shadowCard(theme), padding: 25 }}
        label={t`Redemption rate`}
        disabled={redemptionRateDisabled}
        toggleDisabled={
          hasFundingTarget(fundAccessConstraint)
            ? (checked: boolean) => {
                if (checked) {
                  tokenForm.setFieldsValue({ redemptionRate: '50' })
                } else {
                  tokenForm.setFieldsValue({ redemptionRate: '100' })
                }
                setRedemptionRateDisabled(!checked)
              }
            : undefined
        }
      />

      <Form.Item style={{ marginTop: '2rem' }}>
        <Button htmlType="submit" type="primary">
          <Trans>Save token configuration</Trans>
        </Button>
      </Form.Item>
    </Form>
  )
}
