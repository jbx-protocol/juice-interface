import { CrownFilled } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'

import { Button, Space, Tooltip } from 'antd'
import WithdrawModal from 'components/v1/FundingCycle/modals/WithdrawModal'
import Balance from 'components/Navbar/Balance'
import CurrencySymbol from 'components/shared/CurrencySymbol'
import TooltipLabel from 'components/shared/TooltipLabel'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { ThemeContext } from 'contexts/themeContext'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { PayoutMod } from 'models/mods'
import { CSSProperties, useContext, useState } from 'react'
import { formatWad, fromPerbicent } from 'utils/formatNumber'
import { hasFundingTarget } from 'utils/fundingCycle'

import PayoutModsList from '../../shared/PayoutModsList'

export default function Spending({
  payoutMods,
}: {
  payoutMods: PayoutMod[] | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { balanceInCurrency, projectId, owner, currentFC, isPreviewMode } =
    useContext(V1ProjectContext)

  const [withdrawModalVisible, setWithdrawModalVisible] = useState<boolean>()

  if (!currentFC) return null

  const untapped = currentFC.target.sub(currentFC.tapped)

  const withdrawable = balanceInCurrency?.gt(untapped)
    ? untapped
    : balanceInCurrency

  const smallHeaderStyle: CSSProperties = {
    fontSize: '.7rem',
    fontWeight: 500,
    cursor: 'default',
    color: colors.text.secondary,
  }

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
                  currency={currentFC.currency.toNumber() as V1CurrencyOption}
                />
                {formatWad(withdrawable, { precision: 4 }) || '0'}{' '}
              </span>
              <TooltipLabel
                style={smallHeaderStyle}
                label={t`AVAILABLE`}
                tip={t`The funds available to withdraw for this funding cycle after the ${fromPerbicent(
                  currentFC.fee,
                )}% JBX fee is subtracted. This number won't roll over to the next funding cycle, so funds should be withdrawn before it ends.`}
              />
            </div>
            <Button
              type="ghost"
              size="small"
              onClick={() => setWithdrawModalVisible(true)}
              disabled={isPreviewMode}
            >
              <Trans>Distribute funds</Trans>
            </Button>
          </div>
          <div style={{ ...smallHeaderStyle, color: colors.text.tertiary }}>
            <div>
              <Trans>
                <CurrencySymbol
                  currency={currentFC.currency.toNumber() as V1CurrencyOption}
                />
                {formatWad(currentFC.tapped, { precision: 4 }) || '0'}
                {hasFundingTarget(currentFC) ? (
                  <span>/{formatWad(currentFC.target, { precision: 4 })} </span>
                ) : null}{' '}
                withdrawn
              </Trans>
            </div>

            <div>
              <Tooltip title={t`Project owner balance`}>
                <Space>
                  <Balance address={owner} />
                  <Trans>
                    <CrownFilled /> owner balance
                  </Trans>
                </Space>
              </Tooltip>
            </div>
          </div>
        </div>

        {currentFC.target.gt(0) && (
          <div>
            <TooltipLabel
              label={
                <h4 style={{ display: 'inline-block' }}>
                  <Trans>Funding Distribution</Trans>
                </h4>
              }
              tip={t`Available funds are distributed according to the payouts below.`}
            />
            <PayoutModsList
              mods={payoutMods}
              fundingCycle={currentFC}
              projectId={projectId}
              fee={currentFC.fee}
            />
          </div>
        )}
      </Space>

      <WithdrawModal
        visible={withdrawModalVisible}
        onCancel={() => setWithdrawModalVisible(false)}
        onConfirmed={() => setWithdrawModalVisible(false)}
      />
    </div>
  )
}
