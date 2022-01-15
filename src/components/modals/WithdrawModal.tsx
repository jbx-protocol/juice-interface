import { Space } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import { Trans } from '@lingui/macro'

import CurrencySymbol from 'components/shared/CurrencySymbol'
import FormattedAddress from 'components/shared/FormattedAddress'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import FormattedNumberInput from 'components/shared/inputs/FormattedNumberInput'
import PayoutModsList from 'components/shared/PayoutModsList'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { CurrencyOption } from 'models/currency-option'
import { useContext, useEffect, useState } from 'react'
import { currencyName } from 'utils/currency'
import { formatWad, fromPerbicent, fromWad, parseWad } from 'utils/formatNumber'
import { amountSubFee, feeForAmount } from 'utils/math'

import { CURRENCY_ETH, CURRENCY_USD } from 'constants/currency'

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
  const [tapAmount, setTapAmount] = useState<string>()
  const { transactor, contracts } = useContext(UserContext)
  const {
    balanceInCurrency,
    projectId,
    currentFC,
    currentPayoutMods,
    owner,
    terminal,
  } = useContext(ProjectContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

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

  const untapped = currentFC.target.sub(currentFC.tapped)

  const withdrawable = balanceInCurrency?.gt(untapped)
    ? untapped
    : balanceInCurrency

  function tap() {
    if (
      !transactor ||
      !contracts?.TerminalV1_1 ||
      !currentFC ||
      !projectId ||
      !terminal?.version
    )
      return

    setLoading(true)

    if (!tapAmount) {
      setLoading(false)
      return
    }

    const minAmount = (
      currentFC.currency.eq(CURRENCY_USD)
        ? converter.usdToWei(tapAmount)
        : parseWad(tapAmount)
    )?.sub(1e12) // Arbitrary value subtracted

    transactor(
      terminal.version === '1.1'
        ? contracts.TerminalV1_1
        : contracts.TerminalV1,
      'tap',
      [
        projectId.toHexString(),
        parseWad(tapAmount).toHexString(),
        currentFC.currency.toHexString(),
        minAmount?.toHexString(),
      ],
      {
        onDone: () => {
          setLoading(false)
        },
        onConfirmed: () => onConfirmed && onConfirmed(),
      },
    )
  }

  return (
    <Modal
      title="Withdraw funds"
      visible={visible}
      onOk={tap}
      onCancel={() => {
        setTapAmount(undefined)
        onCancel && onCancel()
      }}
      okButtonProps={{
        disabled: !tapAmount || tapAmount === '0',
      }}
      confirmLoading={loading}
      okText="Withdraw"
      width={640}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <Trans>Total funds:</Trans>{' '}
            <div>
              <CurrencySymbol
                currency={currentFC.currency.toNumber() as CurrencyOption}
              />
              {formatWad(withdrawable, { precision: 4 })}
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div>
              <Trans>JBX Fee ({fromPerbicent(currentFC.fee)}%):</Trans>
            </div>
            <div>
              -{' '}
              <CurrencySymbol
                currency={currentFC.currency.toNumber() as CurrencyOption}
              />
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
              <CurrencySymbol
                currency={currentFC.currency.toNumber() as CurrencyOption}
              />
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
                  {currencyName(
                    currentFC.currency.toNumber() as CurrencyOption,
                  )}
                </span>
                <InputAccessoryButton
                  content="MAX"
                  onClick={() => setTapAmount(fromWad(withdrawable))}
                />
              </div>
            }
          />

          <div style={{ color: colors.text.primary, marginBottom: 10 }}>
            <span style={{ fontWeight: 500 }}>
              <CurrencySymbol currency={CURRENCY_ETH} />
              {formatWad(
                amountSubFee(
                  currentFC.currency.eq(CURRENCY_USD)
                    ? converter.usdToWei(tapAmount)
                    : parseWad(tapAmount),
                  currentFC.fee,
                ),
                { precision: 4 },
              )}
            </span>{' '}
            <Trans>
              after {fromPerbicent(currentFC.fee?.toString())}% JBX fee
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
              fee={currentFC.fee}
            />
          </div>
        ) : (
          <p>
            <CurrencySymbol currency={CURRENCY_ETH} />
            <Trans>
              {formatWad(
                amountSubFee(
                  currentFC.currency.eq(CURRENCY_USD)
                    ? converter.usdToWei(tapAmount)
                    : parseWad(tapAmount),
                  currentFC.fee,
                ),
                { precision: 4 },
              )}{' '}
              will go to the project owner: <FormattedAddress address={owner} />
            </Trans>
          </p>
        )}
      </Space>
    </Modal>
  )
}
