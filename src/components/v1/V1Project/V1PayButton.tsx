import { t, Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useContext, useState } from 'react'
import { formatWad, fromWad } from 'utils/formatNumber'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'
import useWeiConverter from 'hooks/WeiConverter'
import PayWarningModal from 'components/shared/PayWarningModal'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { PayButtonProps } from 'components/shared/inputs/Pay/PayInputGroup'

import { readNetwork } from 'constants/networks'
import { disablePayOverrides } from 'constants/v1/overrides'
import { V1_PROJECT_IDS } from 'constants/v1/projectIds'
import { V1_CURRENCY_USD } from 'constants/v1/currency'
import V1ConfirmPayOwnerModal from './modals/V1ConfirmPayOwnerModal'

export default function V1PayButton({
  payAmount,
  payInCurrency,
}: PayButtonProps) {
  const { projectId, currentFC, metadata, isArchived, terminal } =
    useContext(V1ProjectContext)

  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)
  const [payWarningModalVisible, setPayWarningModalVisible] =
    useState<boolean>(false)

  const weiPayAmt = useWeiConverter<V1CurrencyOption>({
    currency: payInCurrency as V1CurrencyOption,
    amount: payAmount,
  })

  if (!metadata || !currentFC) return null

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
      <Button
        style={{ width: '100%' }}
        type="primary"
        onClick={
          parseFloat(fromWad(weiPayAmt))
            ? () => setPayWarningModalVisible(true)
            : undefined
        }
      >
        {payButtonText}
      </Button>
      {payInCurrency === V1_CURRENCY_USD && (
        <div style={{ fontSize: '.7rem' }}>
          <Trans>
            Paid as <CurrencySymbol currency="ETH" />
          </Trans>
          {formatWad(weiPayAmt) || '0'}
        </div>
      )}
      <PayWarningModal
        visible={payWarningModalVisible}
        onOk={() => {
          setPayWarningModalVisible(false)
          setPayModalVisible(true)
        }}
        onCancel={() => setPayWarningModalVisible(false)}
      />
      <V1ConfirmPayOwnerModal
        visible={payModalVisible}
        onSuccess={() => setPayModalVisible(false)}
        onCancel={() => setPayModalVisible(false)}
        weiAmount={weiPayAmt}
        payButtonText={payButtonText}
      />
    </>
  )
}
