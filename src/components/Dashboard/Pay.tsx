import { BigNumber } from '@ethersproject/bignumber'
import { Button, Tooltip } from 'antd'
import ConfirmPayOwnerModal from 'components/modals/ConfirmPayOwnerModal'
import PayWarningModal from 'components/modals/PayWarningModal'
import AMMPrices from 'components/shared/AMMPrices'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { readNetwork } from 'constants/networks'
import { disablePayOverrides } from 'constants/overrides'
import { ProjectContext } from 'contexts/projectContext'
import { parseEther } from 'ethers/lib/utils'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { CurrencyOption } from 'models/currency-option'
import { useContext, useMemo, useState } from 'react'
import { currencyName } from 'utils/currency'
import { formatWad } from 'utils/formatNumber'
import { decodeFundingCycleMetadata } from 'utils/fundingCycle'
import { weightedRate } from 'utils/math'

import CurrencySymbol from '../shared/CurrencySymbol'
import { CURRENCY_ETH } from 'constants/currency'

export default function Pay() {
  const [payIn, setPayIn] = useState<CurrencyOption>(0)
  const [payAmount, setPayAmount] = useState<string>()
  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)
  const [payWarningModalVisible, setPayWarningModalVisible] =
    useState<boolean>(false)

  const {
    projectId,
    currentFC,
    metadata,
    tokenSymbol,
    isArchived,
    tokenAddress,
  } = useContext(ProjectContext)

  const converter = useCurrencyConverter()

  const weiPayAmt =
    payIn === 1 ? converter.usdToWei(payAmount) : parseEther(payAmount ?? '0')

  function pay() {
    setPayWarningModalVisible(true)
  }

  const formatReceivedTickets = (wei: BigNumber) =>
    formatWad(weightedRate(currentFC, wei, 'payer'), { decimals: 0 })

  const overridePayDisabled =
    projectId &&
    disablePayOverrides[readNetwork.name]?.has(projectId.toNumber())

  const payButton = useMemo(() => {
    if (!metadata || !currentFC) return null

    const fcMetadata = decodeFundingCycleMetadata(currentFC?.metadata)

    if (!fcMetadata) return

    const payButtonText = metadata.payButton?.length
      ? metadata.payButton
      : 'Pay'

    if (isArchived) {
      return (
        <Tooltip
          title="This project has been archived and cannot be paid."
          className="block"
        >
          <Button style={{ width: '100%' }} type="primary" disabled>
            {payButtonText}
          </Button>
        </Tooltip>
      )
    } else if (
      fcMetadata.reservedRate === 200 ||
      fcMetadata.payIsPaused ||
      overridePayDisabled
    ) {
      let disabledMessage: string

      if (fcMetadata.reservedRate === 200) {
        disabledMessage =
          'Paying this project is currently disabled, because the token reserved rate is 100% and no tokens will be earned by making a payment.'
      } else if (fcMetadata.payIsPaused) {
        disabledMessage = 'Payments are paused for the current funding cycle.'
      } else {
        disabledMessage = 'Paying this project is currently disabled.'
      }

      return (
        <Tooltip title={disabledMessage} className="block">
          <Button style={{ width: '100%' }} type="primary" disabled>
            {payButtonText}
          </Button>
        </Tooltip>
      )
    } else {
      return (
        <Button
          style={{ width: '100%' }}
          type="primary"
          disabled={currentFC.configured.eq(0) || isArchived}
          onClick={weiPayAmt ? pay : undefined}
        >
          {payButtonText}
        </Button>
      )
    }
  }, [metadata, currentFC, isArchived, overridePayDisabled, weiPayAmt])

  if (!currentFC || !projectId || !metadata) return null

  return (
    <div>
      {tokenSymbol && tokenAddress && (
        <AMMPrices
          tokenSymbol={tokenSymbol}
          tokenAddress={tokenAddress}
          style={{ marginBottom: '0.5rem' }}
        />
      )}
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

          <div style={{ fontSize: '.7rem' }}>
            Receive{' '}
            {weiPayAmt?.gt(0) ? (
              formatReceivedTickets(weiPayAmt) + ' ' + (tokenSymbol ?? 'tokens')
            ) : (
              <span>
                {formatReceivedTickets(
                  (payIn === 0 ? parseEther('1') : converter.usdToWei('1')) ??
                    BigNumber.from(0),
                )}{' '}
                {tokenSymbol ?? 'tokens'}/{currencyName(payIn)}
              </span>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', minWidth: 150 }}>
          {payButton}
          {payIn === 1 && (
            <div style={{ fontSize: '.7rem' }}>
              Paid as <CurrencySymbol currency={CURRENCY_ETH} />
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
