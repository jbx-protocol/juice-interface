import { RightCircleOutlined } from '@ant-design/icons'
import { BigNumber } from '@ethersproject/bignumber'
import { Trans } from '@lingui/macro'
import ETHAmount from 'components/currency/ETHAmount'
import USDAmount from 'components/currency/USDAmount'
import EtherscanLink from 'components/EtherscanLink'
import FundingProgressBar from 'components/Project/FundingProgressBar'
import StatLine from 'components/Project/StatLine'
import TooltipLabel from 'components/TooltipLabel'
import V1ProjectTokenBalance from 'components/v1/shared/V1ProjectTokenBalance'
import { ThemeContext } from 'contexts/themeContext'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useCurrencyConverter } from 'hooks/CurrencyConverter'
import { useEthBalanceQuery } from 'hooks/EthBalance'
import { NetworkName } from 'models/network-name'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { useContext, useState } from 'react'
import { hasFundingTarget } from 'utils/v1/fundingCycle'

import { V1CurrencyName } from 'utils/v1/currency'

import { VolumeStatLine } from 'components/Project/VolumeStatLine'

import { readNetwork } from 'constants/networks'
import { textPrimary, textSecondary } from 'constants/styles/text'
import { V1_CURRENCY_ETH, V1_CURRENCY_USD } from 'constants/v1/currency'
import { V1_PROJECT_IDS } from 'constants/v1/projectIds'
import { V1BalancesModal } from './modals/V1BalancesModal'

export default function Paid() {
  const [balancesModalVisible, setBalancesModalVisible] = useState<boolean>()
  const { theme } = useContext(ThemeContext)
  const { colors } = theme

  const {
    projectId,
    currentFC,
    balanceInCurrency,
    balance,
    owner,
    earned,
    overflow,
  } = useContext(V1ProjectContext)

  const converter = useCurrencyConverter()
  const { data: ownerBalance } = useEthBalanceQuery(owner)

  const overflowInCurrency = converter.wadToCurrency(
    overflow ?? 0,
    V1CurrencyName(currentFC?.currency.toNumber() as V1CurrencyOption),
    'ETH',
  )

  const secondaryTextStyle = textSecondary(theme)

  if (!currentFC) return null

  const spacing =
    hasFundingTarget(currentFC) && currentFC.target.gt(0) ? 15 : 10

  const formatCurrencyAmount = (amt: BigNumber | undefined) => {
    if (!amt) return null

    if (currentFC.currency.eq(V1_CURRENCY_ETH)) {
      return <ETHAmount amount={amt} precision={2} padEnd />
    }

    if (currentFC.currency.eq(V1_CURRENCY_USD)) {
      return <USDAmount amount={amt} precision={2} padEnd />
    }

    return null
  }

  const isConstitutionDAO =
    readNetwork.name === NetworkName.mainnet &&
    projectId === V1_PROJECT_IDS.CONSTITUTION_DAO

  return (
    <>
      <VolumeStatLine
        totalVolume={earned}
        color={
          isConstitutionDAO ? colors.text.brand.primary : colors.text.primary
        }
        convertToCurrency={isConstitutionDAO ? 'USD' : undefined}
      />
      <div style={{ marginTop: spacing, marginBottom: spacing }}>
        <StatLine
          statLabel={<Trans>In Juicebox</Trans>}
          statLabelTip={
            <Trans>The balance of this project in the Juicebox contract.</Trans>
          }
          statValue={
            <div
              style={{
                ...textPrimary,
                color: isConstitutionDAO
                  ? colors.text.primary
                  : colors.text.brand.primary,
                marginLeft: 10,
              }}
            >
              {currentFC.currency.eq(V1_CURRENCY_USD) ? (
                <span style={secondaryTextStyle}>
                  <ETHAmount amount={balance} precision={2} padEnd={true} />{' '}
                </span>
              ) : (
                ''
              )}
              {formatCurrencyAmount(balanceInCurrency)}
            </div>
          }
        />

        {hasFundingTarget(currentFC) &&
          (currentFC.target.gt(0) ? (
            <StatLine
              statLabel={<Trans>Distributed</Trans>}
              statLabelTip={
                <Trans>
                  The amount that has been distributed from the Juicebox balance
                  in this funding cycle, out of the current funding target. No
                  more than the funding target can be distributed in a single
                  funding cycle—any remaining ETH in Juicebox is overflow, until
                  the next cycle begins.
                </Trans>
              }
              statValue={
                <div
                  style={{
                    ...secondaryTextStyle,
                    color: colors.text.primary,
                  }}
                >
                  {formatCurrencyAmount(currentFC.tapped)} /{' '}
                  {formatCurrencyAmount(currentFC.target)}
                </div>
              }
            />
          ) : (
            <div
              style={{
                ...secondaryTextStyle,
                textAlign: 'right',
              }}
            >
              <TooltipLabel
                tip={
                  <Trans>
                    The target for this funding cycle is 0, meaning all funds in
                    Juicebox are currently considered overflow. Overflow can be
                    redeemed by token holders, but not distributed.
                  </Trans>
                }
                label={<Trans>100% overflow</Trans>}
              />
            </div>
          ))}

        {hasFundingTarget(currentFC) && currentFC.target.gt(0) && (
          <FundingProgressBar
            targetAmount={currentFC.target}
            overflowAmountInTargetCurrency={overflowInCurrency}
            balanceInTargetCurrency={balanceInCurrency}
          />
        )}
      </div>

      <StatLine
        statLabel={<Trans>In wallet</Trans>}
        statLabelTip={
          <>
            <p>
              <Trans>The balance of the project owner's wallet.</Trans>
            </p>{' '}
            <EtherscanLink value={owner} type="address" />
          </>
        }
        statValue={
          <span>
            <span style={secondaryTextStyle}>
              <V1ProjectTokenBalance
                style={{ display: 'inline-block' }}
                wallet={owner}
                projectId={V1_PROJECT_IDS.JUICEBOX_DAO}
                hideHandle
              />{' '}
              +{' '}
            </span>
            <span style={textPrimary}>
              <ETHAmount amount={ownerBalance} precision={2} padEnd={true} />
            </span>
          </span>
        }
      />

      <div
        style={{
          textAlign: 'right',
        }}
      >
        <span
          style={{ ...secondaryTextStyle, cursor: 'pointer' }}
          onClick={() => setBalancesModalVisible(true)}
        >
          <Trans>All assets</Trans> <RightCircleOutlined />
        </span>
      </div>

      <V1BalancesModal
        visible={balancesModalVisible}
        onCancel={() => setBalancesModalVisible(false)}
      />
    </>
  )
}
