import { Button, Tooltip } from 'antd'
import { Trans, t } from '@lingui/macro'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useJBChainId, useJBProjectId, useJBRuleset, useJBTokenContext } from 'juice-sdk-react'
import { useProjectDispatch, useProjectSelector, useProjectStore } from '../redux/hooks'

import { EthereumLogo } from './EthereumLogo'
import { FirstCycleCountdownCallout } from './FirstCycleCountdownCallout'
import { PayRedeemInput } from './PayRedeemInput'
import { PreventOverspendingPayCard } from './PreventOverspendingPayCard'
import { ProjectHeaderLogo } from 'components/Project/ProjectHeader/ProjectHeaderLogo'
import { V4V5_CURRENCY_ETH } from 'packages/v4v5/utils/currency'
import { projectCartActions } from '../redux/projectCartSlice'
import { useBalance } from 'wagmi'
import { usePayProjectDisabled } from 'packages/v4v5/hooks/usePayProjectDisabled'
import { useProjectHeaderLogo } from 'components/Project/ProjectHeader/hooks/useProjectHeaderLogo'
import { useProjectPaymentTokens } from './PayProjectModal/hooks/useProjectPaymentTokens'
import { useV4V5NftRewards } from 'packages/v4v5/contexts/V4V5NftRewards/V4V5NftRewardsProvider'
import { useWallet } from 'hooks/Wallet'

type PayConfigurationProps = {
  userTokenBalance: number | undefined
  projectHasErc20Token: boolean
  isIssuingTokens: boolean
}

export const PayConfiguration: React.FC<PayConfigurationProps> = ({
  userTokenBalance,
  projectHasErc20Token,
  isIssuingTokens,
}) => {
  const { payDisabled, message: payDisabledMessage, loading: payDisabledLoading } = usePayProjectDisabled()
  const { token } = useJBTokenContext()
  const wallet = useWallet()
  const { isConnected: walletConnected, connect } = useWallet()
  const defaultChainId = useJBChainId()
  
  const selectedChainId = useProjectSelector(state => state.payRedeem.chainId) ?? defaultChainId

  const { data: selectedChainBalance } = useBalance({
    address: wallet.userAddress as `0x${string}`,
    chainId: selectedChainId,
  })

  const tokenReceivedAmount = useProjectPaymentTokens()
  const chosenNftRewards = useProjectSelector(
    state => state.projectCart.chosenNftRewards,
  )
  const {
    nftRewards: {
      rewardTiers,
      flags: { preventOverspending },
    },
  } = useV4V5NftRewards()

  const { projectId, chainId} = useJBProjectId()

  const { ruleset } = useJBRuleset({ projectId, chainId })

  const cartPayAmount = useProjectSelector(
    state => state.projectCart.payAmount?.amount,
  )
  const dispatch = useProjectDispatch()
  const store = useProjectStore()

  const { projectLogoUri: tokenLogo } = useProjectHeaderLogo()

  const [payAmount, setPayAmount] = useState<string>()
  const [fallbackImage, setFallbackImage] = useState<boolean>()

  const tokenBSymbol = token?.data?.symbol // the token the user receives (the project token)

  const amount = cartPayAmount ?? 0
  const insufficientBalance = !selectedChainBalance?.formatted
    ? false
    : amount > parseFloat(selectedChainBalance.formatted)
  const tokenBTicker = tokenBSymbol || 'TOKENS'

  const handleUserPayAmountChange = useCallback(
    (value: string | undefined) => {
      const parsedValue = parseFloat(value || '0')
      dispatch(
        projectCartActions.addPayment({
          amount: !Number.isNaN(parsedValue) ? parsedValue : 0,
          currency: V4V5_CURRENCY_ETH,
        }),
      )
      setPayAmount(value)
    },
    [dispatch],
  )

  const payProject = useCallback(() => {
    if (!walletConnected) {
      connect()
      return
    }
    dispatch(projectCartActions.openPayModal())
  }, [connect, dispatch, walletConnected])

  // Update the pay amount input from the cart
  useEffect(() => {
    const unsubscribe = store.subscribe(() => {
      const state = store.getState()
      const payAmount = state.projectCart.payAmount?.amount
      setPayAmount(payAmount?.toString() ?? '')
    })
    return () => {
      unsubscribe()
    }
  }, [store])

  // TODO include other 'pay disabled' logic, usePayProjectDisabled etc
  const payButtonDisabled = useMemo(() => {
    if (!walletConnected) return false
    return insufficientBalance || !cartPayAmount || payDisabled
  }, [cartPayAmount, insufficientBalance, walletConnected, payDisabled])
  const tooltipMessage = payDisabled ? payDisabledMessage : undefined
  return (
    <div>
      {ruleset?.cycleNumber === 0 ? <FirstCycleCountdownCallout />: null}
      <div className="relative">
        <div className="flex flex-col gap-y-2">
          {rewardTiers?.length && preventOverspending ? (
            <PreventOverspendingPayCard />
          ) : (
            <>
              <PayRedeemInput
                label={t`You pay`}
                token={{
                  balance: wallet.balance,
                  image: <EthereumLogo />,
                  ticker: 'ETH',
                  type: 'eth',
                }}
                value={payAmount ?? cartPayAmount?.toString()}
                onChange={handleUserPayAmountChange}
                cardType="input"
                actionType="pay"
              />
              <PayRedeemInput
                actionType="redeem"
                label={t`You receive`}
                redeemUnavailable={!isIssuingTokens}
                downArrow
                readOnly
                token={{
                  balance: userTokenBalance?.toString(),
                  image:
                    tokenLogo && !fallbackImage ? (
                      <img
                        src={tokenLogo}
                        alt="Token logo"
                        onError={() => setFallbackImage(true)}
                      />
                    ) : (
                      <ProjectHeaderLogo className="h-full w-full" />
                    ),
                  ticker: tokenBTicker,
                  type: projectHasErc20Token ? 'erc20' : 'native',
                }}
                cartNfts={chosenNftRewards}
                value={
                  tokenReceivedAmount.receivedTickets &&
                  !!parseFloat(tokenReceivedAmount.receivedTickets)
                    ? tokenReceivedAmount.receivedTickets
                    : ''
                }
              />
            </>
          )}
        </div>
      </div>

      <Tooltip className="w-full flex-1" title={tooltipMessage}>
        <Button
          style={{ display: 'block', width: '100%' }}
          type="primary"
          className="mt-6"
          size="large"
          disabled={payButtonDisabled || payDisabledLoading}
          onClick={payProject}
        >
          {walletConnected ? (
            insufficientBalance ? (
              <Trans>Insufficient balance</Trans>
            ) : (
              <Trans>Pay project</Trans>
            )
          ) : (
            <Trans>Connect wallet</Trans>
          )}
        </Button>
      </Tooltip>
    </div>
  )
}
