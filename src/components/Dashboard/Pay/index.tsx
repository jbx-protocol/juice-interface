import { Button, Tooltip } from 'antd'
import { t, Trans } from '@lingui/macro'

import ConfirmPayOwnerModal from 'components/modals/ConfirmPayOwnerModal'
import PayWarningModal from 'components/modals/PayWarningModal'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { ProjectContext } from 'contexts/projectContext'
import { parseEther } from 'ethers/lib/utils'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { CurrencyOption } from 'models/currency-option'
import { useContext, useMemo, useState } from 'react'
import { currencyName } from 'utils/currency'
import { formatWad, fromWad } from 'utils/formatNumber'
import { decodeFundingCycleMetadata } from 'utils/fundingCycle'

import { disablePayOverrides } from 'constants/overrides'
import { readNetwork } from 'constants/networks'
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
    useContext(ProjectContext)

  const converter = useCurrencyConverter()

  const weiPayAmt =
    payIn === CURRENCY_USD
      ? converter.usdToWei(payAmount)
      : parseEther(payAmount ?? '0')

  function pay() {
    setPayWarningModalVisible(true)
  }

  const overridePayDisabled =
    projectId &&
    disablePayOverrides[readNetwork.name]?.has(projectId.toNumber())

  const payButton = useMemo(() => {
    if (!metadata || !currentFC) return null

    const fcMetadata = decodeFundingCycleMetadata(currentFC?.metadata)

    if (!fcMetadata) return

    const payButtonText = metadata.payButton?.length
      ? metadata.payButton
      : t`Pay`
    const isV1AndMaxRR =
      terminal?.version === '1' && fcMetadata.reservedRate === 200

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
    } else if (fcMetadata.payIsPaused || overridePayDisabled || isV1AndMaxRR) {
      let disabledMessage: string

      if (isV1AndMaxRR) {
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
      console.log('currentFC.configured.eq(0): ', currentFC.configured.eq(0))
      return (
        <Button
          style={{ width: '100%' }}
          type="primary"
          disabled={currentFC.configured.eq(0) || isArchived}
          onClick={parseFloat(fromWad(weiPayAmt)) ? pay : undefined}
        >
          {payButtonText}
        </Button>
      )
    }
  }, [
    metadata,
    currentFC,
    isArchived,
    overridePayDisabled,
    weiPayAmt,
    terminal,
  ])

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
