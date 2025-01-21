import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Tooltip } from 'antd'
import { Callout } from 'components/Callout/Callout'
import { useJBRulesetContext } from 'juice-sdk-react'
import { useV4NftRewards } from 'packages/v4/contexts/V4NftRewards/V4NftRewardsProvider'
import { usePayoutLimit } from 'packages/v4/hooks/usePayoutLimit'
import { useProjectHasErc20Token } from 'packages/v4/hooks/useProjectHasErc20Token'
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math'
import { useV4TokensPanel } from 'packages/v4/views/V4ProjectDashboard/V4ProjectTabs/V4TokensPanel/hooks/useV4TokensPanel'
import React, { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { useProjectDispatch, useProjectSelector } from '../redux/hooks'
import { payRedeemActions } from '../redux/payRedeemSlice'
import { PayConfiguration } from './PayConfiguration'
import { PayProjectModal } from './PayProjectModal/PayProjectModal'
import { RedeemConfiguration } from './RedeemConfiguration'
import { V4NftCreditsCallouts } from './V4NftCreditsCallouts'

type PayRedeemCardProps = {
  className?: string
}

export const V4PayRedeemCard: React.FC<PayRedeemCardProps> = ({
  className,
}) => {
  const { ruleset, rulesetMetadata } = useJBRulesetContext()
  const state = useProjectSelector(state => state.payRedeem.cardState)
  const nftRewards = useV4NftRewards()
  const { data: payoutLimit } = usePayoutLimit()
  const dispatch = useProjectDispatch()

  const projectHasErc20Token = useProjectHasErc20Token()

  // TODO: We should probably break out tokens panel hook into reusable module
  const { userTokenBalance: panelBalance } = useV4TokensPanel()
  const tokenBalance = React.useMemo(() => {
    if (!panelBalance) return undefined
    return panelBalance.toFloat()
  }, [panelBalance])
  const redeems = {
    loading: ruleset.isLoading,
    enabled:
      rulesetMetadata.data?.cashOutTaxRate &&
      rulesetMetadata.data.cashOutTaxRate.value > 0n,
  }

  const isIssuingTokens = React.useMemo(() => {
    const weight = ruleset.data?.weight
    return Boolean(weight && weight.value > 0n)
  }, [ruleset.data?.weight])

  const noticeText = React.useMemo(() => {
    if (!isIssuingTokens) {
      return undefined
    }
    const showNfts =
      !nftRewards.loading &&
      (nftRewards.nftRewards.rewardTiers ?? []).length > 0

    if (showNfts) {
      return t`Project is currently only issuing NFTs`
    }

    return t`Project isn't currently issuing tokens`
  }, [isIssuingTokens, nftRewards.loading, nftRewards.nftRewards.rewardTiers])

  const redeemDisabled =
    !rulesetMetadata.data?.cashOutTaxRate ||
    payoutLimit?.amount === MAX_PAYOUT_LIMIT

  return (
    <div className={twMerge('flex flex-col', className)}>
      <div
        className={twMerge(
          'flex flex-col rounded-lg border border-grey-200 bg-white p-5 pb-6 shadow-[0_6px_16px_0_rgba(0,_0,_0,_0.04)] dark:border-slate-600 dark:bg-slate-700',
        )}
      >
        <div>
          <ChoiceButton
            selected={state === 'pay'}
            onClick={() => dispatch(payRedeemActions.changeToPay())}
          >
            <Trans>Pay</Trans>
          </ChoiceButton>
          {redeemDisabled ? null : (
            <ChoiceButton
              selected={state === 'redeem'}
              tooltip={t`Cash out tokens for a portion of this project's treasury`}
              onClick={() => {
                dispatch(payRedeemActions.changeToRedeem())
              }}
              disabled={!redeems.enabled}
            >
              <Trans>Cash out</Trans>
            </ChoiceButton>
          )}
        </div>

        <div className="mt-5">
          {state === 'pay' ? (
            <PayConfiguration
              userTokenBalance={tokenBalance}
              projectHasErc20Token={projectHasErc20Token}
              isIssuingTokens={isIssuingTokens}
            />
          ) : (
            <RedeemConfiguration
              userTokenBalance={tokenBalance}
              projectHasErc20Token={projectHasErc20Token}
            />
          )}
        </div>
      </div>

      {/* <EthPerTokenAccordion /> */}

      {!isIssuingTokens && noticeText && (
        <Callout.Info
          className="mt-6 py-2 px-3.5 text-xs leading-5 dark:bg-slate-700"
          collapsible={false}
          icon={<InformationCircleIcon className="h-5 w-5" />}
        >
          {noticeText}
        </Callout.Info>
      )}

      <V4NftCreditsCallouts />

      {/* TODO */}
      {/* {projectHasErc20Token && unclaimedTokenBalance?.gt(0) && (
        <ClaimErc20Callout className="mt-4" unclaimed={unclaimedTokenBalance} />
      )} */}

      <PayProjectModal />
    </div>
  )
}

const ChoiceButton = ({
  children,
  onClick,
  selected,
  tooltip,
  disabled,
}: {
  children: React.ReactNode
  onClick?: () => void
  selected?: boolean
  tooltip?: ReactNode
  disabled?: boolean
}) => {
  if (disabled) {
    tooltip = t`Disabled for this project`
  }

  return (
    <Tooltip title={tooltip}>
      <button
        disabled={disabled}
        onClick={onClick}
        className={twMerge(
          'w-fit rounded-full px-4 py-1.5 text-base font-medium transition-colors',
          selected
            ? 'bg-grey-100 text-grey-900 dark:bg-slate-900 dark:text-slate-100'
            : !disabled
            ? 'bg-transparent text-grey-500 hover:bg-grey-100 hover:text-grey-900 dark:text-slate-300 dark:hover:bg-slate-600 dark:hover:text-slate-100'
            : 'cursor-not-allowed text-grey-400 dark:text-slate-300',
        )}
      >
        {children}
      </button>
    </Tooltip>
  )
}
