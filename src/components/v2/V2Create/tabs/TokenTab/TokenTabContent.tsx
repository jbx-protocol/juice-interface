import { t, Trans } from '@lingui/macro'
import { Col, Form, Row } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'
import { ThemeContext } from 'contexts/themeContext'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import ReservedTokensFormItem from 'components/v2/V2Create/tabs/TokenTab/ReservedTokensFormItem'

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
import FormActionbar from '../../FormActionBar'
import { formBottomMargin } from '../../constants'
import { TabContentProps } from '../../models'

type TokenFormFields = {
  discountRate: string
  reservedRate: string
  redemptionRate: string
}

export default function TokenTabContent({ onFinish }: TabContentProps) {
  const [tokenForm] = useForm<TokenFormFields>()
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { theme } = useContext(ThemeContext)

  const {
    fundingCycleMetadata,
    fundingCycleData,
    fundAccessConstraints,
    reserveTokenGroupedSplits: reduxReserveTokenGroupedSplits,
  } = useAppSelector(state => state.editingV2Project)

  const reduxDiscountRate = fundingCycleData?.discountRate
  const reduxReservedRate = fundingCycleMetadata?.reservedRate
  const reduxRedemptionRate = fundingCycleMetadata?.redemptionRate

  // Assume the first item is the one of interest.
  const fundAccessConstraint =
    getDefaultFundAccessConstraint<SerializedV2FundAccessConstraint>(
      fundAccessConstraints,
    )

  const [reserveTokenSplits, setReserveTokenSplits] = useState<Split[]>(
    reduxReserveTokenGroupedSplits?.splits ?? [],
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
      const newReserveTokenSplits = reserveTokenSplits.map(split =>
        sanitizeSplit(split),
      )

      dispatch(editingV2ProjectActions.setDiscountRate(fields.discountRate))
      dispatch(editingV2ProjectActions.setReservedRate(fields.reservedRate))
      dispatch(editingV2ProjectActions.setRedemptionRate(fields.redemptionRate))
      dispatch(
        editingV2ProjectActions.setReserveTokenSplits(newReserveTokenSplits),
      )

      onFinish?.()
    },
    [dispatch, reserveTokenSplits, onFinish],
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
    setReserveTokenSplits(reserveTokenSplits)
  }, [
    reduxDiscountRate,
    reduxReservedRate,
    reduxRedemptionRate,
    reserveTokenSplits,
    tokenForm,
  ])

  // initially fill form with any existing redux state
  useEffect(() => {
    resetTokenForm()
  }, [resetTokenForm])

  return (
    <Row gutter={32}>
      <Col md={10} xs={24}>
        <Form
          form={tokenForm}
          layout="vertical"
          onFinish={() => onTokenFormSaved(tokenForm.getFieldsValue(true))}
          style={{ marginBottom: formBottomMargin }}
        >
          {hasFundingDuration(fundingCycleData) ? (
            <p style={{ color: colors.text.primary }}>
              <Trans>
                <strong>Note: </strong>Once your first funding cycle starts,
                updates you make to token attributes will{' '}
                <i>not be applied immediately</i> and only take effect in{' '}
                <i>upcoming funding cycles.</i>
              </Trans>
            </p>
          ) : null}

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
            reserveTokenSplits={reserveTokenSplits}
            onReserveTokenSplitsChange={setReserveTokenSplits}
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
            value={
              tokenForm.getFieldValue('redemptionRate') ?? reduxRedemptionRate
            }
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
          <FormActionbar />
        </Form>
      </Col>
      <Col md={12} xs={0}></Col>
    </Row>
  )
}
