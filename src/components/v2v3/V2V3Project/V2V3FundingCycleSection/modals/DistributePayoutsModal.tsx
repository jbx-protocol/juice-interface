import { ExclamationCircleOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Form, Space, Tooltip } from 'antd'
import { Callout } from 'components/Callout'
import ETHToUSD from 'components/currency/ETHToUSD'
import CurrencySymbol from 'components/CurrencySymbol'
import InputAccessoryButton from 'components/InputAccessoryButton'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import TransactionModal from 'components/TransactionModal'
import SplitList from 'components/v2v3/shared/SplitList'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useETHPaymentTerminalFee } from 'hooks/v2v3/contractReader/ETHPaymentTerminalFee'
import { useDistributePayoutsTx } from 'hooks/v2v3/transactor/DistributePayouts'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import { useContext, useEffect, useState } from 'react'
import { formatWad, fromWad, parseWad } from 'utils/format/formatNumber'
import { V2V3CurrencyName, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'

export default function DistributePayoutsModal({
  open,
  onCancel,
  onConfirmed,
}: {
  open?: boolean
  onCancel?: VoidFunction
  onConfirmed?: VoidFunction
}) {
  const {
    balanceInDistributionLimitCurrency,
    distributionLimit,
    usedDistributionLimit,
    distributionLimitCurrency,
    payoutSplits,
    projectOwnerAddress,
  } = useContext(V2V3ProjectContext)

  const [transactionPending, setTransactionPending] = useState<boolean>()
  const [loading, setLoading] = useState<boolean>()
  const [distributionAmount, setDistributionAmount] = useState<string>()

  const distributePayoutsTx = useDistributePayoutsTx()
  const ETHPaymentTerminalFee = useETHPaymentTerminalFee()
  const converter = useCurrencyConverter()

  useEffect(() => {
    if (!distributionLimit) return

    const unusedFunds = distributionLimit?.sub(usedDistributionLimit ?? 0) ?? 0
    const distributable = balanceInDistributionLimitCurrency?.gt(unusedFunds)
      ? unusedFunds
      : balanceInDistributionLimitCurrency

    setDistributionAmount(fromWad(distributable))
  }, [
    balanceInDistributionLimitCurrency,
    distributionLimit,
    usedDistributionLimit,
  ])

  async function executeDistributePayoutsTx() {
    if (!distributionLimitCurrency || !distributionAmount) return

    const minAmount = (
      distributionLimitCurrency.eq(V2V3_CURRENCY_USD)
        ? converter.usdToWei(distributionAmount)
        : parseWad(distributionAmount)
    )?.sub(1e12) // Arbitrary value subtracted
    if (!minAmount) return

    setLoading(true)

    const txSuccessful = await distributePayoutsTx(
      {
        amount: parseWad(distributionAmount), // TODO use terminal.decimals() to parse amount
        currency: distributionLimitCurrency.toNumber() as V2V3CurrencyOption,
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

  if (!ETHPaymentTerminalFee) return null

  const distributionCurrencyName = V2V3CurrencyName(
    distributionLimitCurrency?.toNumber() as V2V3CurrencyOption,
  )

  const unusedFunds =
    distributionLimit?.sub(usedDistributionLimit ?? 0) ?? BigNumber.from(0)

  const distributable = balanceInDistributionLimitCurrency?.gt(unusedFunds)
    ? unusedFunds
    : balanceInDistributionLimitCurrency

  const grossAvailableAmount = formatWad(distributable, { precision: 4 })

  const tooltipTitle =
    distributionCurrencyName === 'ETH' && distributable?.gt(0) ? (
      <ETHToUSD ethAmount={distributable} />
    ) : undefined

  return (
    <TransactionModal
      title={<Trans>Distribute funds</Trans>}
      open={open}
      onOk={executeDistributePayoutsTx}
      onCancel={() => {
        setDistributionAmount(undefined)
        onCancel?.()
      }}
      okButtonProps={{
        disabled: !distributionAmount || distributionAmount === '0',
      }}
      confirmLoading={loading}
      transactionPending={transactionPending}
      okText={t`Distribute funds`}
      connectWalletText={t`Connect wallet to distribute`}
      width={640}
    >
      <Space direction="vertical" size="large" className="w-full">
        <Callout.Info>
          <Trans>
            Distributions to Ethereum addresses incur a 2.5% JBX membership fee.
          </Trans>
        </Callout.Info>

        <Form layout="vertical">
          <Form.Item
            className="mb-0"
            label={<Trans>Amount to distribute</Trans>}
            extra={
              <div className="mb-2 text-black dark:text-slate-100">
                <Trans>
                  <span className="font-medium">
                    <Tooltip title={tooltipTitle}>
                      <CurrencySymbol currency={distributionCurrencyName} />
                      {grossAvailableAmount}
                    </Tooltip>
                  </span>{' '}
                  available to distribute
                </Trans>
              </div>
            }
          >
            <FormattedNumberInput
              placeholder="0"
              value={distributionAmount}
              onChange={value => setDistributionAmount(value)}
              min={0}
              accessory={
                <div className="flex items-center">
                  <span className="mr-2 text-black dark:text-slate-100">
                    {V2V3CurrencyName(
                      distributionLimitCurrency?.toNumber() as V2V3CurrencyOption,
                    )}
                  </span>
                  <InputAccessoryButton
                    content={<Trans>MAX</Trans>}
                    onClick={() =>
                      setDistributionAmount(
                        formatWad(distributable, { precision: 4 }),
                      )
                    }
                  />
                </div>
              }
            />
          </Form.Item>
        </Form>
        <div>
          <h4>
            <Trans>Payout recipients</Trans>
          </h4>

          {payoutSplits?.length === 0 ? (
            <Callout.Info className="mb-4">
              <Trans>
                There are no payouts defined for this funding cycle. The project
                owner will receive all available funds.
              </Trans>
            </Callout.Info>
          ) : null}

          <SplitList
            totalValue={parseWad(distributionAmount)}
            currency={distributionLimitCurrency}
            splits={payoutSplits ?? []}
            projectOwnerAddress={projectOwnerAddress}
            showAmounts
            showFees
          />
        </div>
        <p className="text-sm">
          <ExclamationCircleOutlined />{' '}
          <Trans>Recipients will receive payouts in ETH.</Trans>
        </p>
      </Space>
    </TransactionModal>
  )
}
