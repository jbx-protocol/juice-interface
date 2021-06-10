import { BigNumber } from '@ethersproject/bignumber'
import { Button, Input, Modal, Space } from 'antd'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import TooltipLabel from 'components/shared/TooltipLabel'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { FundingCycle } from 'models/funding-cycle'
import { useContext, useState } from 'react'
import { currencyName } from 'utils/currency'
import { formatWad, fromWad, parseWad } from 'utils/formatNumber'

import { smallHeaderStyle } from './styles'
import { CurrencyOption } from 'models/currency-option'

export default function Tappable({
  fundingCycle,
  projectId,
  balanceInCurrency,
}: {
  fundingCycle: FundingCycle | undefined
  projectId: BigNumber
  balanceInCurrency: BigNumber | undefined
}) {
  const { transactor, contracts } = useContext(UserContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [tapAmount, setTapAmount] = useState<string>()
  const [withdrawModalVisible, setWithdrawModalVisible] = useState<boolean>()
  const [loadingWithdraw, setLoadingWithdraw] = useState<boolean>()

  const converter = useCurrencyConverter()

  function tap() {
    if (!transactor || !contracts?.Juicer || !fundingCycle) return

    setLoadingWithdraw(true)

    if (!tapAmount) {
      setLoadingWithdraw(false)
      return
    }

    // Arbitrary value subtracted
    const minAmount = fundingCycle.currency.eq(1)
      ? converter.usdToWei(tapAmount)
      : parseWad(tapAmount)

    transactor(
      contracts.Juicer,
      'tap',
      [
        projectId.toHexString(),
        parseWad(tapAmount).toHexString(),
        minAmount?.toHexString(),
      ],
      {
        onDone: () => setLoadingWithdraw(false),
      },
    )
  }

  if (!fundingCycle) return null

  const untapped = fundingCycle.target.sub(fundingCycle.tapped)

  const withdrawable = balanceInCurrency?.gt(untapped)
    ? untapped
    : balanceInCurrency

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <div>
          <span style={{ fontSize: '1rem' }}>
            <CurrencySymbol
              currency={fundingCycle.currency.toNumber() as CurrencyOption}
            />
            {formatWad(withdrawable) || '0'}{' '}
          </span>
          <TooltipLabel
            style={smallHeaderStyle(colors)}
            label="AVAILABLE"
            tip="The funds this project can withdraw for this funding cycle. They won't roll over to the next funding cycle, so they should be withdrawn before this one ends."
          />
        </div>
        <Button
          type="ghost"
          size="small"
          loading={loadingWithdraw}
          onClick={() => setWithdrawModalVisible(true)}
        >
          Withdraw
        </Button>
      </div>
      <div style={{ ...smallHeaderStyle(colors), color: colors.text.tertiary }}>
        <CurrencySymbol
          currency={fundingCycle.currency.toNumber() as CurrencyOption}
        />
        {formatWad(fundingCycle.tapped) || '0'}/{formatWad(fundingCycle.target)}{' '}
        withdrawn
      </div>

      <Modal
        title="Withdraw funds"
        visible={withdrawModalVisible}
        onOk={() => {
          tap()
          setWithdrawModalVisible(false)
        }}
        onCancel={() => {
          setTapAmount(undefined)
          setWithdrawModalVisible(false)
        }}
        okText="Withdraw"
        width={540}
      >
        <div style={{ marginBottom: 10 }}>
          Available to withdraw:{' '}
          <CurrencySymbol
            currency={fundingCycle.currency.toNumber() as CurrencyOption}
          />
          {formatWad(withdrawable)}
        </div>
        <p>Funds will be withdrawn according to this project's mods.</p>
        <Space direction="vertical" style={{ width: '100%' }}>
          <Input
            name="withdrawable"
            placeholder="0"
            suffix={
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <span style={{ marginRight: 8 }}>
                  {currencyName(
                    fundingCycle.currency.toNumber() as CurrencyOption,
                  )}
                </span>
                <InputAccessoryButton
                  content="MAX"
                  onClick={() => setTapAmount(fromWad(withdrawable))}
                />
              </div>
            }
            type="number"
            value={tapAmount}
            max={fromWad(withdrawable)}
            onChange={e => setTapAmount(e.target.value)}
          />
          {fundingCycle.currency.eq(1) && (
            <div style={{ textAlign: 'right' }}>
              {formatWad(converter.usdToWei(tapAmount)) || 0}{' '}
              <CurrencySymbol currency={0} />
            </div>
          )}
        </Space>
      </Modal>
    </div>
  )
}
