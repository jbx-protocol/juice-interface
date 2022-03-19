import { t, Trans } from '@lingui/macro'
import { Button } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'

import { useContext, useState } from 'react'
import { formatWad, fromWad } from 'utils/formatNumber'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'

import { V2ProjectContext } from 'contexts/v2/projectContext'
import { V2_CURRENCY_ETH, V2_CURRENCY_USD } from 'utils/v2/currency'
import PayWarningModal from 'components/shared/PayWarningModal'
import useWeiConverter from 'hooks/WeiConverter'

import { CurrencyOption } from 'models/currencyOption'

import { V2CurrencyOption } from 'models/v2/currencyOption'

import V2ConfirmPayOwnerModal from './V2ConfirmPayOwnerModal'

export default function V2PayButton({
  payAmount,
  payInCurrency,
}: {
  payAmount: string
  payInCurrency: CurrencyOption // TODO make the V2CurrencyOption
}) {
  const { fundingCycle, projectMetadata } = useContext(V2ProjectContext)
  // if (!projectMetadata || !fundingCycle) return null

  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)
  const [payWarningModalVisible, setPayWarningModalVisible] =
    useState<boolean>(false)

  const weiPayAmt = useWeiConverter<V2CurrencyOption>({
    currency: payInCurrency as V2CurrencyOption,
    amount: payAmount,
  })

  const fcMetadata = decodeFundingCycleMetadata(fundingCycle?.metadata)

  if (!fcMetadata) return null

  const payButtonText = projectMetadata?.payButton?.length
    ? projectMetadata.payButton
    : t`Pay`

  //TODO: archived states, other reasons for pay being disabled

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
      {payInCurrency === V2_CURRENCY_USD && (
        <div style={{ fontSize: '.7rem' }}>
          <Trans>
            Paid as <CurrencySymbol currency={V2_CURRENCY_ETH} />
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
      <V2ConfirmPayOwnerModal
        visible={payModalVisible}
        onSuccess={() => setPayModalVisible(false)}
        onCancel={() => setPayModalVisible(false)}
        weiAmount={weiPayAmt}
      />
    </>
  )
}
