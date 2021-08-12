import { CrownFilled } from '@ant-design/icons'
import { Button, Input, Modal, Space, Tooltip } from 'antd'
import Balance from 'components/Navbar/Balance'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import InputAccessoryButton from 'components/shared/InputAccessoryButton'
import TooltipLabel from 'components/shared/TooltipLabel'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { CurrencyOption } from 'models/currency-option'
import { FundingCycle } from 'models/funding-cycle'
import { PayoutMod } from 'models/mods'
import { useContext, useState } from 'react'
import { currencyName } from 'utils/currency'
import { formatWad, fromWad, parseWad } from 'utils/formatNumber'
import { hasFundingTarget } from 'utils/fundingCycle'
import { amountSubFee, feeForAmount } from 'utils/math'

import { fromPerbicent } from '../../utils/formatNumber'
import PayoutModsList from './PayoutModsList'
import { smallHeaderStyle } from './styles'

export default function Spending({
  fundingCycle,
  payoutMods,
}: {
  fundingCycle: FundingCycle | undefined
  payoutMods: PayoutMod[] | undefined
}) {
  const { transactor, contracts, adminFeePercent } = useContext(UserContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { balanceInCurrency, projectId, isOwner, owner } =
    useContext(ProjectContext)

  const [tapAmount, setTapAmount] = useState<string>()
  const [withdrawModalVisible, setWithdrawModalVisible] = useState<boolean>()
  const [loadingWithdraw, setLoadingWithdraw] = useState<boolean>()

  const converter = useCurrencyConverter()

  function tap() {
    if (!transactor || !contracts?.TerminalV1 || !fundingCycle || !projectId)
      return

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
      contracts.TerminalV1,
      'tap',
      [
        projectId.toHexString(),
        parseWad(tapAmount).toHexString(),
        fundingCycle.currency.toHexString(),
        minAmount?.toHexString(),
      ],
      {
        onDone: () => {
          setLoadingWithdraw(false)
          setWithdrawModalVisible(false)
        },
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
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}
          >
            <div>
              <span
                style={{
                  fontSize: '1rem',
                  fontWeight: 500,
                }}
              >
                <CurrencySymbol
                  currency={fundingCycle.currency.toNumber() as CurrencyOption}
                />
                {formatWad(amountSubFee(withdrawable)) || '0'}{' '}
              </span>
              <TooltipLabel
                style={smallHeaderStyle(colors)}
                label="AVAILABLE"
                tip="The funds that can be withdrawn for this funding cycle. They won't roll over to the next funding cycle, so they should be withdrawn before this one ends."
              />
            </div>
            <Button
              type="ghost"
              size="small"
              loading={loadingWithdraw}
              onClick={() => setWithdrawModalVisible(true)}
            >
              Distribute
            </Button>
          </div>
          <div
            style={{ ...smallHeaderStyle(colors), color: colors.text.tertiary }}
          >
            <div>
              <CurrencySymbol
                currency={fundingCycle.currency.toNumber() as CurrencyOption}
              />
              {formatWad(fundingCycle.tapped) || '0'}
              {hasFundingTarget(fundingCycle) && (
                <span>/{formatWad(fundingCycle.target)} </span>
              )}{' '}
              withdrawn
            </div>

            <div>
              <Tooltip title="Project owner balance">
                <Space>
                  <Balance address={owner} />
                  <CrownFilled /> owner balance
                </Space>
              </Tooltip>
            </div>
          </div>
        </div>

        <div>
          <TooltipLabel
            label={<h4 style={{ display: 'inline-block' }}>Spending</h4>}
            tip="Available funds are distributed according to any payouts below."
          />
          <PayoutModsList
            mods={payoutMods}
            fundingCycle={fundingCycle}
            projectId={projectId}
            isOwner={isOwner}
          />
        </div>
      </Space>

      <Modal
        title="Withdraw funds"
        visible={withdrawModalVisible}
        onOk={tap}
        onCancel={() => {
          setTapAmount(undefined)
          setWithdrawModalVisible(false)
        }}
        okText="Withdraw"
        width={540}
      >
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div style={{ marginBottom: 10 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              Available funds:{' '}
              <div>
                <CurrencySymbol
                  currency={fundingCycle.currency.toNumber() as CurrencyOption}
                />
                {formatWad(withdrawable)}
              </div>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div>JBX Fee ({fromPerbicent(adminFeePercent)}%):</div>
              <div>
                -{' '}
                <CurrencySymbol
                  currency={fundingCycle.currency.toNumber() as CurrencyOption}
                />
                {formatWad(feeForAmount(withdrawable) ?? 0)}
              </div>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontWeight: 500,
              }}
            >
              <div>Amount to withdraw:</div>
              <div>
                <CurrencySymbol
                  currency={fundingCycle.currency.toNumber() as CurrencyOption}
                />
                {formatWad(amountSubFee(withdrawable, adminFeePercent) ?? 0)}
              </div>
            </div>
          </div>
          {payoutMods?.length ? (
            <div>
              <p>Funds will be distributed to:</p>
              <PayoutModsList
                mods={payoutMods}
                fundingCycle={fundingCycle}
                projectId={projectId}
                isOwner={false}
              />
            </div>
          ) : (
            <p>Funds will go to the project owner.</p>
          )}

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
