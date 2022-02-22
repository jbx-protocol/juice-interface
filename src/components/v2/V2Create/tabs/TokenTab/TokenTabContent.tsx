import { t, Trans } from '@lingui/macro'
import { Col, Form, Row } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'
import { ThemeContext } from 'contexts/themeContext'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { TicketMod } from 'models/mods'

import {
  CSSProperties,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'
import { SerializedV2FundAccessConstraint } from 'utils/v2/serializers'
import {
  getDefaultFundAccessConstraint,
  hasFundingDuration,
  hasFundingTarget,
} from 'utils/v2/fundingCycle'

import { sanitizeSplit, toMod, toSplit } from 'utils/v2/splits'

import { shadowCard } from 'constants/styles/shadowCard'
import FloatingSaveButton from '../../FloatingSaveButton'
import { formBottomMargin } from '../..'

type TokenFormFields = {
  discountRate: string
  reservedRate: string
  redemptionRate: string
}

export default function TokenTabContent({
  openNextTab,
}: {
  openNextTab: VoidFunction
}) {
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

  const [reserveTokenSplits, setReserveTokenSplits] = useState<TicketMod[]>(
    reduxReserveTokenGroupedSplits?.splits.map(s => toMod(s)) ?? [],
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
        sanitizeSplit(toSplit(split)),
      )

      dispatch(editingV2ProjectActions.setDiscountRate(fields.discountRate))
      dispatch(editingV2ProjectActions.setReservedRate(fields.reservedRate))
      dispatch(editingV2ProjectActions.setRedemptionRate(fields.redemptionRate))
      dispatch(
        editingV2ProjectActions.setReserveTokenSplits(newReserveTokenSplits),
      )
    },
    [dispatch, reserveTokenSplits],
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

  const disableTextStyle: CSSProperties = {
    color: colors.text.primary,
    fontStyle: 'italic',
    fontWeight: 500,
    marginBottom: 10,
  }

  // initially fill form with any existing redux state
  useEffect(() => {
    resetTokenForm()
  }, [resetTokenForm])

  return (
    <Row gutter={32}>
      <Col span={12}>
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

          <FormItems.V2ProjectReserved
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
            setReserveTokenSplits={setReserveTokenSplits}
          />
          <br />
          {!hasFundingDuration(fundingCycleData) && (
            <div style={{ ...disableTextStyle }}>
              <Trans>
                Discount rate disabled when funding cycle duration has not been
                set.
              </Trans>
            </div>
          )}
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
          {!hasFundingTarget(fundAccessConstraint) && (
            <div style={{ ...disableTextStyle }}>
              <Trans>Redemption disabled while no funding target is set.</Trans>
            </div>
          )}
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
          <FloatingSaveButton text={t`Next: Rules`} onClick={openNextTab} />
        </Form>
      </Col>
      <Col span={12}></Col>
    </Row>
  )
}
