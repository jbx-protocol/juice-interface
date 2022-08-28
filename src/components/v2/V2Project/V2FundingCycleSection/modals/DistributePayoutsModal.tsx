import { ExclamationCircleOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { t, Trans } from '@lingui/macro'
import { Form, Space } from 'antd'
import CurrencySymbol from 'components/CurrencySymbol'
import InputAccessoryButton from 'components/InputAccessoryButton'
import SplitList from 'components/v2/shared/SplitList'
import { ThemeContext } from 'contexts/themeContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useETHPaymentTerminalFee } from 'hooks/v2/contractReader/ETHPaymentTerminalFee'
import { useDistributePayoutsTx } from 'hooks/v2/transactor/DistributePayouts'
import { V2CurrencyOption } from 'models/v2/currencyOption'
import { useContext, useEffect, useState } from 'react'
import { formatWad, fromWad, parseWad } from 'utils/formatNumber'
import { V2CurrencyName, V2_CURRENCY_USD } from 'utils/v2/currency'
import { amountSubFee, feeForAmount } from 'utils/v2/math'

import FormattedNumberInputNew from 'components/inputs/FormattedNumberInputNew'
import TransactionModal from 'components/TransactionModal'
import { formatFee } from 'utils/v2/math'

export default function DistributePayoutsModal({
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
  const [transactionPending, setTransactionPending] = useState<boolean>()

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
      distributionLimitCurrency.eq(V2_CURRENCY_USD)
        ? converter.usdToWei(distributionAmount)
        : parseWad(distributionAmount)
    )?.sub(1e12) // Arbitrary value subtracted
    if (!minAmount) return

    setLoading(true)

    const txSuccessful = await distributePayoutsTx(
      {
        amount: parseWad(distributionAmount), // TODO use terminal.decimals() to parse amount
        currency: distributionLimitCurrency.toNumber() as V2CurrencyOption,
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

  const distributionCurrencyName = V2CurrencyName(
    distributionLimitCurrency?.toNumber() as V2CurrencyOption,
  )

  const unusedFunds =
    distributionLimit?.sub(usedDistributionLimit ?? 0) ?? BigNumber.from(0)

  const distributable = balanceInDistributionLimitCurrency?.gt(unusedFunds)
    ? unusedFunds
    : balanceInDistributionLimitCurrency

  const feePercentage = formatFee(ETHPaymentTerminalFee)
  const grossAvailableAmount = formatWad(distributable, { precision: 4 })
  const feeAmount = formatWad(
    feeForAmount(distributable, ETHPaymentTerminalFee) ?? 0,
    {
      precision: 4,
    },
  )
  const netAvailableAmount =
    amountSubFee(distributable, ETHPaymentTerminalFee) ?? BigNumber.from(0)

  const netAvailableAmountFormatted = formatWad(netAvailableAmount, {
    precision: 4,
  })
  const netDistributionAmount = formatWad(
    distributionAmount
      ? amountSubFee(parseWad(distributionAmount), ETHPaymentTerminalFee)
      : BigNumber.from(0),
  )

  return (
    <TransactionModal
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
              <CurrencySymbol currency={distributionCurrencyName} />
              {grossAvailableAmount}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Trans>JBX Fee ({feePercentage}%):</Trans>
            </div>
            <div>
              - <CurrencySymbol currency={distributionCurrencyName} />
              {feeAmount}
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontWeight: 500,
              borderTop: `1px solid ${colors.stroke.tertiary}`,
            }}
          >
            <div>
              <Trans>Available after fee:</Trans>
            </div>
            <div>
              <CurrencySymbol currency={distributionCurrencyName} />
              {netAvailableAmountFormatted}
            </div>
          </div>
        </div>
        <Form layout="vertical">
          <Form.Item
            label={<Trans>Amount to distribute</Trans>}
            style={{ marginBottom: 0 }}
            extra={
              <div style={{ color: colors.text.primary, marginBottom: 10 }}>
                <Trans>
                  <span style={{ fontWeight: 500 }}>
                    <CurrencySymbol currency={distributionCurrencyName} />
                    {netDistributionAmount}
                  </span>{' '}
                  after {feePercentage}% JBX fee
                </Trans>
              </div>
            }
          >
            <FormattedNumberInputNew
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
                    onClick={() =>
                      setDistributionAmount(fromWad(distributable))
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
            <p>
              <Trans>
                There are no payouts defined for this funding cycle. The project
                owner will receive all available funds.
              </Trans>
            </p>
          ) : null}

          <SplitList
            totalValue={netAvailableAmount}
            currency={distributionLimitCurrency}
            splits={payoutSplits ?? []}
            projectOwnerAddress={projectOwnerAddress}
            showSplitValues
          />
        </div>
        <p style={{ fontSize: '0.8rem' }}>
          <ExclamationCircleOutlined />{' '}
          <Trans>Recipients will receive payouts in ETH.</Trans>
        </p>
      </Space>
    </TransactionModal>
  )
}
