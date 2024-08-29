import { InformationCircleIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Tooltip } from 'antd'
import { Callout } from 'components/Callout/Callout'
import { useJBRulesetContext } from 'juice-sdk-react'
import { usePayoutLimit } from 'packages/v4/hooks/usePayoutLimit'
import { MAX_PAYOUT_LIMIT } from 'packages/v4/utils/math'
import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'
import { useProjectDispatch, useProjectSelector } from '../redux/hooks'
import { payRedeemActions } from '../redux/payRedeemSlice'
import { PayConfiguration } from './PayConfiguration'
import { PayProjectModal } from './PayProjectModal/PayProjectModal'
import { RedeemConfiguration } from './RedeemConfiguration'

type PayRedeemCardProps = {
  className?: string
}

export const V4PayRedeemCard: React.FC<PayRedeemCardProps> = ({
  className,
}) => {
  const { ruleset, rulesetMetadata } = useJBRulesetContext()
  const state = useProjectSelector(state => state.payRedeem.cardState)
  // const { value: hasNfts, loading: hasNftsLoading } = useHasNftRewards()
  const { data: payoutLimit } = usePayoutLimit()
  const dispatch = useProjectDispatch()

  const projectHasErc20Token = false // TODO

  // TODO: We should probably break out tokens panel hook into reusable module
  // const { userTokenBalance: panelBalance } = useTokensPanel()
  // const tokenBalance = panelBalance
  //   ? parseFloat(panelBalance.replaceAll(',', ''))
  //   : undefined
  const tokenBalance = 0 // TODO
  const redeems = {
    loading: ruleset.isLoading,
    enabled:
      rulesetMetadata.data?.redemptionRate &&
      rulesetMetadata.data.redemptionRate.value > 0n,
  }

  const weight = ruleset.data?.weight
  const isIssuingTokens = Boolean(weight && weight.value > 0n)
  // const showNfts = hasNfts && !hasNftsLoading
  const noticeText = isIssuingTokens
    ? // showNfts
      //   ? t`Project isn't currently issuing tokens, but is issuing NFTs`
      // :
      t`Project isn't currently issuing tokens`
    : undefined

  const redeemDisabled =
    !rulesetMetadata.data?.redemptionRate ||
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
              tooltip={t`Redeem tokens for a portion of this project's treasury`}
              onClick={() => {
                dispatch(payRedeemActions.changeToRedeem())
              }}
              disabled={!redeems.enabled}
            >
              <Trans>Redeem</Trans>
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

      {/* <NftCreditsCallout /> */}
      {/* 
      {projectHasErc20Token && unclaimedTokenBalance?.gt(0) && (
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
