import { t, Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import { useContext, useState } from 'react'
import { formatWad } from 'utils/formatNumber'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2_CURRENCY_USD } from 'utils/v2/currency'
import PayWarningModal from 'components/shared/PayWarningModal'
import useWeiConverter from 'hooks/WeiConverter'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { PayButtonProps } from 'components/shared/inputs/Pay/PayInputGroup'

import V2ConfirmPayModal from './V2ConfirmPayModal'

export default function V2PayButton({
  payAmount,
  payInCurrency,
  onError,
}: PayButtonProps) {
  const { projectMetadata, fundingCycleMetadata } = useContext(V2ProjectContext)

  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)
  const [payWarningModalVisible, setPayWarningModalVisible] =
    useState<boolean>(false)

  const weiPayAmt = useWeiConverter<V2CurrencyOption>({
    currency: payInCurrency as V2CurrencyOption,
    amount: payAmount,
  })

  if (!fundingCycleMetadata) return null

  const payButtonText = projectMetadata?.payButton?.length
    ? projectMetadata.payButton
    : t`Pay`

  //TODO: archived states, other reasons for pay being disabled

  let disabledMessage: string | undefined
  if (fundingCycleMetadata.pausePay) {
    disabledMessage = t`Payments are paused for the current funding cycle.`
  }

  const isPayDisabled = Boolean(disabledMessage)

  return (
    <>
      <Tooltip
        visible={isPayDisabled ? undefined : false}
        title={disabledMessage}
        className="block"
      >
        <Button
          style={{ width: '100%' }}
          type="primary"
          onClick={() => {
            // if (weiPayAmt?.eq(0)) return
            if (weiPayAmt?.eq(0)) {
              return onError?.()
            }
            setPayWarningModalVisible(true)
          }}
          disabled={isPayDisabled}
        >
          {payButtonText}
        </Button>
      </Tooltip>
      {payInCurrency === V2_CURRENCY_USD && (
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
      <V2ConfirmPayModal
        visible={payModalVisible}
        onSuccess={() => setPayModalVisible(false)}
        onCancel={() => setPayModalVisible(false)}
        weiAmount={weiPayAmt}
      />
    </>
  )
}
