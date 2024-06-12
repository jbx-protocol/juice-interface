import { t, Trans } from '@lingui/macro'
import { Space } from 'antd'
import InputAccessoryButton from 'components/buttons/InputAccessoryButton'
import CurrencySymbol from 'components/currency/CurrencySymbol'
import ETHAmount from 'components/currency/ETHAmount'
import EthereumAddress from 'components/EthereumAddress'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TransactionModal from 'components/modals/TransactionModal'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import PayoutModsList from 'packages/v1/components/shared/PayoutModsList'
import { V1_CURRENCY_USD } from 'packages/v1/constants/currency'
import { V1ProjectContext } from 'packages/v1/contexts/Project/V1ProjectContext'
import { useTapProjectTx } from 'packages/v1/hooks/transactor/useTapProjectTx'
import { V1CurrencyOption } from 'packages/v1/models/currencyOption'
import { V1CurrencyName } from 'packages/v1/utils/currency'
import { amountSubFee, feeForAmount } from 'packages/v1/utils/math'
import { useContext, useEffect, useState } from 'react'
import {
  formatWad,
  fromWad,
  parseWad,
  perbicentToPercent,
} from 'utils/format/formatNumber'

export default function WithdrawModal({
  open,
  onCancel,
  onConfirmed,
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
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
      title={t`Send payouts`}
      open={open}
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
      okText={t`Send payouts`}
      connectWalletText={t`Connect wallet to send payouts`}
      width={640}
    >
      <Space direction="vertical" size="large" className="w-full">
        <div>
          <div className="flex justify-between">
            <Trans>Total:</Trans>{' '}
            <div>
              <CurrencySymbol currency={currentFCCurrency} />
              {formatWad(withdrawable, { precision: 4 })}
            </div>
          </div>
          <div className="flex justify-between">
            <div>
              <Trans>
                JBX membership fee ({perbicentToPercent(currentFC.fee)}%):
              </Trans>
            </div>
            <div>
              - <CurrencySymbol currency={currentFCCurrency} />
              {formatWad(feeForAmount(withdrawable, currentFC.fee) ?? 0, {
                precision: 4,
              })}
            </div>
          </div>
          <div className="flex justify-between font-medium">
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
              <div className="flex items-center">
                <span className="mr-2 text-black dark:text-slate-100">
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

          <div className="mb-2 text-black dark:text-slate-100">
            <span className="font-medium">
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
              <Trans>Payouts will be sent to:</Trans>
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
              project owner: <EthereumAddress address={owner} />
            </Trans>
          </p>
        )}
      </Space>
    </TransactionModal>
  )
}
