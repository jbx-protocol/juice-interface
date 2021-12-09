import { BigNumber } from '@ethersproject/bignumber'
import { Button, Tooltip } from 'antd'
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
import { formatWad } from 'utils/formatNumber'
import { decodeFundingCycleMetadata } from 'utils/fundingCycle'
import { weightedRate } from 'utils/math'

import { disablePayOverrides } from 'constants/overrides'
import { readNetwork } from 'constants/networks'

import CurrencySymbol from '../shared/CurrencySymbol'

export default function Pay() {
  const [payIn, setPayIn] = useState<CurrencyOption>(0)
  const [payAmount, setPayAmount] = useState<string>()
  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)
  const [payWarningModalVisible, setPayWarningModalVisible] =
    useState<boolean>(false)

  const { projectId, currentFC, metadata, tokenSymbol, isArchived } =
    useContext(ProjectContext)

  const converter = useCurrencyConverter()

  const fcMetadata = decodeFundingCycleMetadata(currentFC?.metadata)

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
      fcMetadata?.reservedRate === 200 ||
      fcMetadata?.payIsPaused ||
      overridePayDisabled
    ) {
      return (
        <Tooltip
          title="Paying this project is currently disabled"
          className="block"
        >
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
  }, [
    metadata,
    currentFC,
    isArchived,
    fcMetadata,
    overridePayDisabled,
    weiPayAmt,
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
                {tokenSymbol ?? 'tokens'}/
                <CurrencySymbol currency={payIn} />
              </span>
            )}
          </div>
        </div>

        <div style={{ textAlign: 'center', minWidth: 150 }}>
          {payButton}
          {payIn === 1 && (
            <div style={{ fontSize: '.7rem' }}>
              Paid as <CurrencySymbol currency={0} />
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
