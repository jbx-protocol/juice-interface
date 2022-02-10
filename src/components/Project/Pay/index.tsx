import { Button, Tooltip } from 'antd'
import { t, Trans } from '@lingui/macro'

import ConfirmPayOwnerModal from 'components/Project/modals/ConfirmPayOwnerModal'
import PayWarningModal from 'components/Project/modals/PayWarningModal'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { parseEther } from 'ethers/lib/utils'
import { useCurrencyConverter } from 'hooks/v1/CurrencyConverter'
import { CurrencyOption } from 'models/currency-option'
import { useContext, useMemo, useState } from 'react'
import { currencyName } from 'utils/currency'
import { formatWad, fromWad } from 'utils/formatNumber'
import { decodeFundingCycleMetadata } from 'utils/fundingCycle'
import {
  paymentsPaused,
  isV1AndMaxRR,
  isMoonAndMaxRR,
} from 'utils/paymentsPaused'

import { CURRENCY_ETH, CURRENCY_USD } from 'constants/currency'
import CurrencySymbol from '../../shared/CurrencySymbol'
import PayInputSubText from './PayInputSubText'

export default function Pay() {
  const [payIn, setPayIn] = useState<CurrencyOption>(0)
  const [payAmount, setPayAmount] = useState<string>()
  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)
  const [payWarningModalVisible, setPayWarningModalVisible] =
    useState<boolean>(false)

  const { projectId, currentFC, metadata, isArchived, terminal } =
    useContext(V1ProjectContext)

  const converter = useCurrencyConverter()

  const weiPayAmt =
    payIn === CURRENCY_USD
      ? converter.usdToWei(payAmount)
      : parseEther(payAmount ?? '0')

  function pay() {
    setPayWarningModalVisible(true)
  }

  const payButton = useMemo(() => {
    if (!metadata || !currentFC) return null

    const fcMetadata = decodeFundingCycleMetadata(currentFC?.metadata)

    if (!fcMetadata) return

    const payButtonText = metadata.payButton?.length
      ? metadata.payButton
      : t`Pay`

    // Get individual cases of why payments are paused
    const V1AndMaxRR = isV1AndMaxRR(terminal?.version, fcMetadata?.reservedRate)
    const MoonAndMaxRR = isMoonAndMaxRR(projectId, fcMetadata)

    // Get paymentsPaused for any reason
    const projectPaymentsPaused = paymentsPaused(
      projectId,
      currentFC,
      terminal?.version,
    )

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
    } else if (projectPaymentsPaused) {
      let disabledMessage: string

      if (V1AndMaxRR || MoonAndMaxRR) {
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
    } else {
      // Pay enabled
      return (
        <Button
          style={{ width: '100%' }}
          type="primary"
          onClick={parseFloat(fromWad(weiPayAmt)) ? pay : undefined}
        >
          {payButtonText}
        </Button>
      )
    }
  }, [metadata, currentFC, isArchived, weiPayAmt, terminal, projectId])

  if (!currentFC || !projectId || !metadata) return null

  return (
    <div>
      <div
        style={{
          display: 'flex',
          width: '100%',
        }}
      >
        <div style={{ flex: 1, marginRight: 10 }}>
          <FormattedNumberInput
            placeholder="0"
            disabled={currentFC.configured.eq(0)}
            onChange={val => setPayAmount(val)}
            value={payAmount}
            min={0}
            accessory={
              <InputAccessoryButton
                withArrow={true}
                content={currencyName(payIn)}
                onClick={() => setPayIn(payIn === 0 ? 1 : 0)}
              />
            }
          />
          <PayInputSubText payInCurrrency={payIn} weiPayAmt={weiPayAmt} />
        </div>

        <div style={{ textAlign: 'center', minWidth: 150 }}>
          {payButton}
          {payIn === CURRENCY_USD && (
            <div style={{ fontSize: '.7rem' }}>
              <Trans>
                Paid as <CurrencySymbol currency={CURRENCY_ETH} />
              </Trans>
              {formatWad(weiPayAmt) || '0'}
            </div>
          )}
        </div>
      </div>

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
    </div>
  )
}
