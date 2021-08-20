import { CrownFilled } from '@ant-design/icons'
import { Button, Space, Tooltip } from 'antd'
import WithdrawModal from 'components/modals/WithdrawModal'
import Balance from 'components/Navbar/Balance'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import TooltipLabel from 'components/shared/TooltipLabel'
import { ProjectContext } from 'contexts/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { UserContext } from 'contexts/userContext'
import { CurrencyOption } from 'models/currency-option'
import { PayoutMod } from 'models/mods'
import { useContext, useState } from 'react'
import { formatWad } from 'utils/formatNumber'
import { hasFundingTarget } from 'utils/fundingCycle'
import { amountSubFee } from 'utils/math'

import { fromPerbicent } from '../../utils/formatNumber'
import PayoutModsList from './PayoutModsList'
import { smallHeaderStyle } from './styles'

export default function Spending({
  payoutMods,
}: {
  payoutMods: PayoutMod[] | undefined
}) {
  const { adminFeePercent } = useContext(UserContext)
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { balanceInCurrency, projectId, isOwner, owner, currentFC } =
    useContext(ProjectContext)

  const [withdrawModalVisible, setWithdrawModalVisible] = useState<boolean>()

  if (!currentFC) return null

  const untapped = currentFC.target.sub(currentFC.tapped)

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
                  currency={currentFC.currency.toNumber() as CurrencyOption}
                />
                {formatWad(amountSubFee(withdrawable, adminFeePercent)) || '0'}{' '}
              </span>
              <TooltipLabel
                style={smallHeaderStyle(colors)}
                label="AVAILABLE"
                tip={`The funds available to withdraw for this funding cycle after the ${fromPerbicent(
                  adminFeePercent,
                )}% JBX fee is subtracted. This number won't roll over to the next funding cycle, so funds should be withdrawn before it ends.`}
              />
            </div>
            <Button
              type="ghost"
              size="small"
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
                currency={currentFC.currency.toNumber() as CurrencyOption}
              />
              {formatWad(currentFC.tapped) || '0'}
              {hasFundingTarget(currentFC) && (
                <span>/{formatWad(currentFC.target)} </span>
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
            fundingCycle={currentFC}
            projectId={projectId}
            isOwner={isOwner}
          />
        </div>
      </Space>

      <WithdrawModal
        visible={withdrawModalVisible}
        onCancel={() => setWithdrawModalVisible(false)}
        onConfirmed={() => setWithdrawModalVisible(false)}
      />
    </div>
  )
}
