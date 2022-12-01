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
import { V1_CURRENCY_ETH, V1_CURRENCY_USD } from 'constants/v1/currency'
import { V1_PROJECT_IDS } from 'constants/v1/projectIds'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V1BalancesModal } from './modals/V1BalancesModal'
import { classNames } from 'utils/classNames'

export function TreasuryStatsSection() {
  const [balancesModalVisible, setBalancesModalVisible] = useState<boolean>()

  const { currentFC, balanceInCurrency, balance, owner, earned, overflow } =
    useContext(V1ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

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

  const isConstitutionDAO =
    readNetwork.name === NetworkName.mainnet &&
    projectId === V1_PROJECT_IDS.CONSTITUTION_DAO

  return (
    <>
      <VolumeStatLine
        totalVolume={earned}
        convertToCurrency={isConstitutionDAO ? 'USD' : undefined}
      />
      <div
        className={classNames(
          hasFundingTarget(currentFC) && currentFC.target.gt(0)
            ? 'my-4'
            : 'my-2',
        )}
      >
        <StatLine
          statLabel={<Trans>In Juicebox</Trans>}
          statLabelTip={
            <Trans>The balance of this project in the Juicebox contract.</Trans>
          }
          statValue={
            <div
              className={classNames(
                'ml-2 text-lg font-medium',
                // TODO: Bespoke styles for the constitution DAO - should we remove?
                isConstitutionDAO
                  ? 'text-black dark:text-slate-100'
                  : 'text-juice-400 dark:text-juice-300',
              )}
            >
              {currentFC.currency.eq(V1_CURRENCY_USD) ? (
                <span className="text-sm font-medium uppercase text-grey-400 dark:text-grey-600">
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
                  The amount distributed from the Juicebox balance in this
                  funding cycle, out of the current funding target. No more than
                  the funding target can be distributed in a single funding
                  cycle. Any remaining ETH in Juicebox is overflow until the
                  next cycle begins.
                </Trans>
              }
              statValue={
                <div className="text-sm font-medium uppercase text-black dark:text-slate-100">
                  {formatCurrencyAmount(currentFC.tapped)} /{' '}
                  {formatCurrencyAmount(currentFC.target)}
                </div>
              }
            />
          ) : (
            <div className="text-right text-sm font-medium uppercase text-grey-400 dark:text-grey-600">
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
            <span className="text-sm font-medium uppercase text-grey-400 dark:text-grey-600">
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
          className="cursor-pointer text-sm font-medium uppercase text-grey-400 dark:text-grey-600"
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
