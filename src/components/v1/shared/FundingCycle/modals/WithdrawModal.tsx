import { t, Trans } from '@lingui/macro'
import { Space } from 'antd'

import CurrencySymbol from 'components/CurrencySymbol'
import FormattedAddress from 'components/FormattedAddress'
import InputAccessoryButton from 'components/InputAccessoryButton'
import TransactionModal from 'components/TransactionModal'
import PayoutModsList from 'components/v1/shared/PayoutModsList'

import ETHAmount from 'components/currency/ETHAmount'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useTapProjectTx } from 'hooks/v1/transactor/TapProjectTx'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { useContext, useEffect, useState } from 'react'
import {
  formatWad,
  fromWad,
  parseWad,
  perbicentToPercent,
} from 'utils/format/formatNumber'
import { V1CurrencyName } from 'utils/v1/currency'
import { amountSubFee, feeForAmount } from 'utils/v1/math'

import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { V1_CURRENCY_USD } from 'constants/v1/currency'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'

export default function WithdrawModal({
  visible,
  onCancel,
  onConfirmed,
}: {
  visible?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const { balanceInCurrency, currentFC, currentPayoutMods, owner } =
    useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const [loading, setLoading] = useState<boolean>()
  const [tapAmount, setTapAmount] = useState<string>()
  const [transactionPending, setTransactionPending] = useState<boolean>()

  const tapProjectTx = useTapProjectTx()
  const converter = useCurrencyConverter()

  useEffect(() => {
    if (!currentFC) return

    const untapped = currentFC.target.sub(currentFC.tapped)
    const withdrawable = balanceInCurrency?.gt(untapped)
      ? untapped
      : balanceInCurrency

    setTapAmount(fromWad(withdrawable))
  }, [balanceInCurrency, currentFC])

  if (!currentFC) return null

  const currentFCCurrency = V1CurrencyName(
    currentFC.currency.toNumber() as V1CurrencyOption,
  )
  const untapped = currentFC.target.sub(currentFC.tapped)

  const withdrawable = balanceInCurrency?.gt(untapped)
    ? untapped
    : balanceInCurrency

  const convertedAmountSubFee = amountSubFee(
    currentFC.currency.eq(V1_CURRENCY_USD)
      ? converter.usdToWei(tapAmount)
      : parseWad(tapAmount),
    currentFC.fee,
  )

  async function executeTapTx() {
    if (!currentFC || !tapAmount) return

    const minAmount = (
      currentFC.currency.eq(V1_CURRENCY_USD)
        ? converter.usdToWei(tapAmount)
        : parseWad(tapAmount)
    )?.sub(1e12) // Arbitrary value subtracted

    if (!minAmount) return

    setLoading(true)

    const txSuccessful = await tapProjectTx(
      {
        tapAmount: parseWad(tapAmount),
        currency: currentFC.currency.toNumber() as V1CurrencyOption,
        minAmount,
      },
      {
        onDone: () => {
          setTransactionPending(true)
        },
        onConfirmed: () => {
          setLoading(false)
          setTransactionPending(false)
          onConfirmed?.()
        },
      },
    )

    if (!txSuccessful) {
      setLoading(false)
      setTransactionPending(false)
    }
  }

  return (
    <TransactionModal
      title={t`Distribute funds`}
      visible={visible}
      onOk={executeTapTx}
      onCancel={() => {
        setTapAmount(undefined)
        onCancel?.()
      }}
      okButtonProps={{
        disabled: !tapAmount || tapAmount === '0',
      }}
      confirmLoading={loading}
      transactionPending={transactionPending}
      okText={t`Distribute funds`}
      connectWalletText={t`Connect wallet to distribute`}
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
              <Trans>JBX Fee ({perbicentToPercent(currentFC.fee)}%):</Trans>
            </div>
            <div>
              - <CurrencySymbol currency={currentFCCurrency} />
              {formatWad(feeForAmount(withdrawable, currentFC.fee) ?? 0, {
                precision: 4,
              })}
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
              {formatWad(amountSubFee(withdrawable, currentFC.fee) ?? 0, {
                precision: 4,
              })}
            </div>
          </div>
        </div>
        <div>
          <FormattedNumberInput
            placeholder="0"
            value={tapAmount}
            onChange={value => setTapAmount(value)}
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
                  {V1CurrencyName(
                    currentFC.currency.toNumber() as V1CurrencyOption,
                  )}
                </span>
                <InputAccessoryButton
                  content={t`MAX`}
                  onClick={() => setTapAmount(fromWad(withdrawable))}
                />
              </div>
            }
          />

          <div style={{ color: colors.text.primary, marginBottom: 10 }}>
            <span style={{ fontWeight: 500 }}>
              <ETHAmount amount={convertedAmountSubFee} />
            </span>{' '}
            <Trans>
              after {perbicentToPercent(currentFC.fee?.toString())}% JBX fee
            </Trans>
          </div>
        </div>

        {currentPayoutMods?.length ? (
          <div>
            <h4>
              <Trans>Funds will be distributed to:</Trans>
            </h4>
            <PayoutModsList
              total={amountSubFee(parseWad(tapAmount || '0'), currentFC.fee)}
              mods={currentPayoutMods}
              fundingCycle={currentFC}
              projectId={projectId}
              feePerbicent={currentFC.fee}
            />
          </div>
        ) : (
          <p>
            <Trans>
              <ETHAmount amount={convertedAmountSubFee} /> will go to the
              project owner: <FormattedAddress address={owner} />
            </Trans>
          </p>
        )}
      </Space>
    </TransactionModal>
  )
}
