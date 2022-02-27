import { t, Trans } from '@lingui/macro'
import { Button, Form, FormInstance, Tooltip } from 'antd'
import { PayFormFields } from 'components/shared/inputs/PayInput'
import ConfirmPayOwnerModal from 'components/v1/V1Project/modals/ConfirmPayOwnerModal'
import PayWarningModal from 'components/v1/V1Project/modals/PayWarningModal'
import CurrencySymbol from 'components/shared/CurrencySymbol'

import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useContext, useState } from 'react'
import { formatWad, fromWad } from 'utils/formatNumber'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'
import V1AmountToWei from 'utils/v1/V1AmountToWei'

import { readNetwork } from 'constants/networks'
import { disablePayOverrides } from 'constants/v1/overrides'
import { V1_PROJECT_IDS } from 'constants/v1/projectIds'
import { V1_CURRENCY_ETH, V1_CURRENCY_USD } from 'constants/v1/currency'

export default function V1PayButton({
  form,
}: {
  form: FormInstance<PayFormFields>
}) {
  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)
  const [payWarningModalVisible, setPayWarningModalVisible] =
    useState<boolean>(false)
  const { projectId, currentFC, metadata, isArchived, terminal } =
    useContext(V1ProjectContext)
  if (!metadata || !currentFC) return null

  const initiatePay = () => {
    setPayModalVisible(true)
  }

  const payAmount: string = form.getFieldValue('amount')
  const payInCurrency = form.getFieldValue('payInCurrency')

  const weiPayAmt = V1AmountToWei({
    currency: payInCurrency,
    amount: payAmount,
  })

  const fcMetadata = decodeFundingCycleMetadata(currentFC?.metadata)

  if (!fcMetadata) return null

  const payButtonText = metadata.payButton?.length ? metadata.payButton : t`Pay`

  // v1 projects who still use 100% RR to disable pay
  const isV1AndMaxRR =
    terminal?.version === '1' && fcMetadata.reservedRate === 200

  // Edge case for MoonDAO, upgraded to v1.1 but can't use payIsPaused for now
  const isMoonAndMaxRR =
    projectId?.eq(V1_PROJECT_IDS.MOON_DAO) && fcMetadata.reservedRate === 200

  const overridePayDisabled =
    projectId &&
    disablePayOverrides[readNetwork.name]?.has(projectId.toNumber())

  if (isArchived) {
    return (
      <Tooltip
        title={t`This project has been archived and cannot be paid.`}
        className="block"
      >
        <Button style={{ width: '100%' }} type="primary" disabled>
          {payButtonText}
        </Button>
      </Tooltip>
    )
  } else if (
    fcMetadata.payIsPaused || // v1.1 only
    overridePayDisabled ||
    isV1AndMaxRR || // v1 projects who still use 100% RR to disable pay
    currentFC.configured.eq(0) || // Edge case, see sequoiacapitaldao
    isMoonAndMaxRR // Edge case for MoonDAO
  ) {
    let disabledMessage: string

    if (isV1AndMaxRR || isMoonAndMaxRR) {
      disabledMessage = t`Paying this project is currently disabled, because the token reserved rate is 100% and no tokens will be earned by making a payment.`
    } else if (fcMetadata.payIsPaused) {
      disabledMessage = t`Payments are paused for the current funding cycle.`
    } else {
      disabledMessage = t`Paying this project is currently disabled.`
    }

    return (
      <Tooltip title={disabledMessage} className="block">
        <Button style={{ width: '100%' }} type="primary" disabled>
          {payButtonText}
        </Button>
      </Tooltip>
    )
  }

  // Pay enabled
  return (
    <>
      <Form.Item>
        <Button
          style={{ width: '100%' }}
          type="primary"
          onClick={parseFloat(fromWad(weiPayAmt)) ? initiatePay : undefined}
        >
          {payButtonText}
        </Button>
        {payInCurrency === V1_CURRENCY_USD && (
          <div style={{ fontSize: '.7rem' }}>
            <Trans>
              Paid as <CurrencySymbol currency={V1_CURRENCY_ETH} />
            </Trans>
            {formatWad(weiPayAmt) || '0'}
          </div>
        )}
      </Form.Item>
      <PayWarningModal
        visible={payWarningModalVisible}
        onOk={() => {
          setPayWarningModalVisible(false)
          setPayModalVisible(true)
        }}
        onCancel={() => setPayWarningModalVisible(false)}
      />
      <ConfirmPayOwnerModal
        visible={payModalVisible}
        onSuccess={() => setPayModalVisible(false)}
        onCancel={() => setPayModalVisible(false)}
        weiAmount={weiPayAmt}
      />
    </>
  )
}
