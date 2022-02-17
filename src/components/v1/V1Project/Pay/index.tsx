import { Button, Tooltip } from 'antd'
import { t, Trans } from '@lingui/macro'

import ConfirmPayOwnerModal from 'components/v1/V1Project/modals/ConfirmPayOwnerModal'
import PayWarningModal from 'components/v1/V1Project/modals/PayWarningModal'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { parseEther } from 'ethers/lib/utils'
import { useCurrencyConverter } from 'hooks/v1/CurrencyConverter'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { useContext, useMemo, useState } from 'react'
import { currencyName } from 'utils/v1/currency'
import { formatWad, fromWad } from 'utils/formatNumber'
import { decodeFundingCycleMetadata } from 'utils/fundingCycle'

import { disablePayOverrides } from 'constants/v1/overrides'
import { readNetwork } from 'constants/networks'
import { V1_CURRENCY_ETH, V1_CURRENCY_USD } from 'constants/v1/currency'
import CurrencySymbol from '../../../shared/CurrencySymbol'
import PayInputSubText from './PayInputSubText'
import { V1_PROJECT_IDS } from 'constants/v1/projectIds'

export default function Pay() {
  const [payIn, setPayIn] = useState<V1CurrencyOption>(0)
  const [payAmount, setPayAmount] = useState<string>()
  const [payModalVisible, setPayModalVisible] = useState<boolean>(false)
  const [payWarningModalVisible, setPayWarningModalVisible] =
    useState<boolean>(false)

  const { projectId, currentFC, metadata, isArchived, terminal } =
    useContext(V1ProjectContext)

  const converter = useCurrencyConverter()

  const weiPayAmt =
    payIn === V1_CURRENCY_USD
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

    // v1 projects who still use 100% RR to disable pay
    const isV1AndMaxRR =
      terminal?.version === '1' && fcMetadata.reservedRate === 200

    // Edge case for MoonDAO, upgraded to v1.1 but can't use payIsPaused for now
    const isMoonAndMaxRR =
      projectId?.eq(V1_PROJECT_IDS.MOON_DAO) && fcMetadata.reservedRate === 200

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
  }, [
    metadata,
    currentFC,
    isArchived,
    overridePayDisabled,
    weiPayAmt,
    terminal,
    projectId,
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
          {payIn === V1_CURRENCY_USD && (
            <div style={{ fontSize: '.7rem' }}>
              <Trans>
                Paid as <CurrencySymbol currency={V1_CURRENCY_ETH} />
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
