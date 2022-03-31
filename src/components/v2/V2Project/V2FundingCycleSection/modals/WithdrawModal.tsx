import { Space } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import { Trans } from '@lingui/macro'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import FormattedAddress from 'components/shared/FormattedAddress'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import { ThemeContext } from 'contexts/themeContext'
import { useCurrencyConverter } from 'hooks/v1/CurrencyConverter'
import { useContext, useEffect, useState } from 'react'
import { formatWad, fromWad, parseWad } from 'utils/formatNumber'
import { amountSubFee, feeForAmount } from 'utils/math'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import SplitList from 'components/v2/shared/SplitList'
import { V2CurrencyName, V2_CURRENCY_USD } from 'utils/v2/currency'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { useDistributePayoutsTx } from 'hooks/v2/transactor/DistributePayouts'
import { useETHPaymentTerminalFee } from 'hooks/v2/contractReader/ETHPaymentTerminalFee'
import { BigNumber } from '@ethersproject/bignumber'

import { formatFee } from 'utils/v2/math'

export default function WithdrawModal({
  visible,
  onCancel,
  onConfirmed,
}: {
  visible?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const [loading, setLoading] = useState<boolean>()
  const [distributionAmount, setDistributionAmount] = useState<string>()
  const {
    balanceInDistributionLimitCurrency,
    distributionLimit,
    usedDistributionLimit,
    distributionLimitCurrency,
    payoutSplits,
    projectOwnerAddress,
  } = useContext(V2ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const distributePayoutsTx = useDistributePayoutsTx()
  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()

  const converter = useCurrencyConverter()

  useEffect(() => {
    if (!distributionLimit) return

    const untapped = distributionLimit?.sub(usedDistributionLimit ?? 0) ?? 0
    const withdrawable = balanceInDistributionLimitCurrency?.gt(untapped)
      ? untapped
      : balanceInDistributionLimitCurrency

    setDistributionAmount(fromWad(withdrawable))
  }, [
    balanceInDistributionLimitCurrency,
    distributionLimit,
    usedDistributionLimit,
  ])

  const currentFCCurrency = V2CurrencyName(
    distributionLimitCurrency?.toNumber() as V2CurrencyOption,
  )
  const untapped =
    distributionLimit?.sub(usedDistributionLimit ?? 0) ?? BigNumber.from(0)

  const withdrawable = balanceInDistributionLimitCurrency?.gt(untapped)
    ? untapped
    : balanceInDistributionLimitCurrency

  function executeDistributePayoutsTx() {
    if (!distributionLimitCurrency || !distributionAmount) return

    const minAmount = (
      distributionLimitCurrency.eq(V2_CURRENCY_USD)
        ? converter.usdToWei(distributionAmount)
        : parseWad(distributionAmount)
    )?.sub(1e12) // Arbitrary value subtracted
    if (!minAmount) return

    const amount = distributionLimitCurrency.eq(V2_CURRENCY_USD)
      ? converter.usdToWei(distributionAmount)
      : parseWad(distributionAmount)

    setLoading(true)
    distributePayoutsTx(
      {
        amount,
        currency: distributionLimitCurrency.toNumber() as V2CurrencyOption,
      },
      {
        onDone: () => setLoading(false),
        onConfirmed,
      },
    )
  }

  if (!ETHPaymentTerminalFee) return null

  const feePercent = formatFee(ETHPaymentTerminalFee)

  return (
    <Modal
      title={<Trans>Distribute funds</Trans>}
      visible={visible}
      onOk={executeDistributePayoutsTx}
      onCancel={() => {
        setDistributionAmount(undefined)
        onCancel?.()
      }}
      okButtonProps={{
        disabled: !distributionAmount || distributionAmount === '0',
      }}
      confirmLoading={loading}
      okText={<Trans>Distribute funds</Trans>}
      width={640}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Trans>Total funds:</Trans>{' '}
            <div>
              <CurrencySymbol currency={currentFCCurrency} />
              {formatWad(withdrawable, { precision: 4 })}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Trans>JBX Fee ({feePercent}%):</Trans>
            </div>
            <div>
              - <CurrencySymbol currency={currentFCCurrency} />
              {formatWad(
                feeForAmount(withdrawable, BigNumber.from(feePercent)) ?? 0,
                {
                  precision: 4,
                },
              )}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 500,
            }}
          >
            <div>
              <Trans>Available after fee:</Trans>
            </div>
            <div>
              <CurrencySymbol currency={currentFCCurrency} />
              {formatWad(
                amountSubFee(withdrawable, BigNumber.from(feePercent)) ?? 0,
                {
                  precision: 4,
                },
              )}
            </div>
          </div>
        </div>
        <div>
          <FormattedNumberInput
            placeholder="0"
            value={distributionAmount}
            onChange={value => setDistributionAmount(value)}
            accessory={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    marginRight: 8,
                    color: colors.text.primary,
                  }}
                >
                  {V2CurrencyName(
                    distributionLimitCurrency?.toNumber() as V2CurrencyOption,
                  )}
                </span>
                <InputAccessoryButton
                  content={<Trans>MAX</Trans>}
                  onClick={() => setDistributionAmount(fromWad(withdrawable))}
                />
              </div>
            }
          />

          <div style={{ color: colors.text.primary, marginBottom: 10 }}>
            <Trans>
              <span style={{ fontWeight: 500 }}>
                <CurrencySymbol currency="ETH" />
                {formatWad(
                  amountSubFee(
                    distributionLimitCurrency?.eq(V2_CURRENCY_USD)
                      ? converter.usdToWei(distributionAmount)
                      : parseWad(distributionAmount),
                    BigNumber.from(feePercent),
                  ),
                  { precision: 4 },
                )}
              </span>{' '}
              after {feePercent}% JBX fee
            </Trans>
          </div>
        </div>

        {payoutSplits?.length ? (
          <div>
            <h4>
              <Trans>Payout recipients</Trans>
            </h4>
            <SplitList
              distributionLimit={distributionLimit}
              distributionLimitCurrency={distributionLimitCurrency}
              splits={payoutSplits}
              projectOwnerAddress={projectOwnerAddress}
              showSplitValues
            />
          </div>
        ) : (
          <p>
            <CurrencySymbol currency="ETH" />
            <Trans>
              {formatWad(
                amountSubFee(
                  distributionLimitCurrency?.eq(V2_CURRENCY_USD)
                    ? converter.usdToWei(distributionAmount)
                    : parseWad(distributionAmount),
                  BigNumber.from(feePercent),
                ),
                { precision: 4 },
              )}{' '}
              will go to the project owner:{' '}
              <FormattedAddress address={projectOwnerAddress} />
            </Trans>
          </p>
        )}
      </Space>
    </Modal>
  )
}
