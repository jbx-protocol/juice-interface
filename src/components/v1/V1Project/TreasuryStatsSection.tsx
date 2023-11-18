import { RightCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import EtherscanLink from 'components/EtherscanLink'
import FundingProgressBar from 'components/Project/FundingProgressBar'
import StatLine from 'components/Project/StatLine'
import { VolumeStatLine } from 'components/Project/VolumeStatLine/VolumeStatLine'
import TooltipLabel from 'components/TooltipLabel'
import ETHAmount from 'components/currency/ETHAmount'
import USDAmount from 'components/currency/USDAmount'
import { DISTRIBUTION_LIMIT_EXPLANATION } from 'components/strings'
import V1ProjectTokenBalance from 'components/v1/shared/V1ProjectTokenBalance'
import { V1_CURRENCY_ETH, V1_CURRENCY_USD } from 'constants/v1/currency'
import { V1_PROJECT_IDS } from 'constants/v1/projectIds'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { BigNumber } from 'ethers'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useEthBalanceQuery } from 'hooks/useEthBalance'
import { V1CurrencyOption } from 'models/v1/currencyOption'
import { useContext, useState } from 'react'
import { classNames } from 'utils/classNames'
import { V1CurrencyName } from 'utils/v1/currency'
import { hasFundingTarget } from 'utils/v1/fundingCycle'
import { V1BalancesModal } from './modals/V1BalancesModal'

export function TreasuryStatsSection() {
  const { currentFC, balanceInCurrency, balance, owner, earned, overflow } =
    useContext(V1ProjectContext)

  const [balancesModalVisible, setBalancesModalVisible] = useState<boolean>()

  const converter = useCurrencyConverter()
  const { data: ownerBalance } = useEthBalanceQuery(owner)

  const overflowInCurrency = converter.wadToCurrency(
    overflow ?? 0,
    V1CurrencyName(currentFC?.currency.toNumber() as V1CurrencyOption),
    'ETH',
  )

  if (!currentFC) return null

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

  return (
    <>
      <VolumeStatLine totalVolume={earned} />
      <div
        className={classNames(
          hasFundingTarget(currentFC) && currentFC.target.gt(0)
            ? 'my-4'
            : 'my-2',
        )}
      >
        <StatLine
          statLabel={<Trans>Project balance</Trans>}
          statLabelTip={
            <Trans>The amount of ETH that this project has right now.</Trans>
          }
          statValue={
            <div className="ml-2 text-lg font-medium text-juice-400 dark:text-juice-300">
              {currentFC.currency.eq(V1_CURRENCY_USD) ? (
                <span className="text-sm font-medium uppercase text-grey-400 dark:text-grey-300">
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
              statLabel={<Trans>Payouts</Trans>}
              statLabelTip={DISTRIBUTION_LIMIT_EXPLANATION}
              statValue={
                <div className="text-sm font-medium uppercase text-black dark:text-slate-100">
                  {formatCurrencyAmount(currentFC.tapped)} /{' '}
                  {formatCurrencyAmount(currentFC.target)}
                </div>
              }
            />
          ) : (
            <div className="text-right text-sm font-medium uppercase text-grey-400 dark:text-slate-200">
              <TooltipLabel
                tip={
                  <Trans>
                    No payouts are scheduled for this cycle. All ETH is
                    available for redemption (subject to the redemption rate).
                  </Trans>
                }
                label={<Trans>No payouts</Trans>}
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
        statLabel={<Trans>Owner wallet balance</Trans>}
        statLabelTip={
          <>
            <p>
              <Trans>
                The amount of ETH in the wallet that owns this project.
              </Trans>
            </p>{' '}
            <EtherscanLink value={owner} type="address" />
          </>
        }
        statValue={
          <span>
            <span className="text-sm font-medium uppercase text-grey-400 dark:text-grey-300">
              <V1ProjectTokenBalance
                className="inline-block"
                wallet={owner}
                projectId={V1_PROJECT_IDS.JUICEBOX_DAO}
                hideHandle
              />{' '}
              +{' '}
            </span>
            <span className="text-lg font-medium">
              <ETHAmount amount={ownerBalance} precision={2} padEnd={true} />
            </span>
          </span>
        }
      />

      <div className="text-right">
        <span
          className="cursor-pointer text-sm font-medium uppercase text-grey-400 dark:text-grey-300"
          onClick={() => setBalancesModalVisible(true)}
          role="button"
        >
          <Trans>All assets</Trans> <RightCircleOutlined />
        </span>
      </div>

      <V1BalancesModal
        open={balancesModalVisible}
        onCancel={() => setBalancesModalVisible(false)}
      />
    </>
  )
}
