import { Trans, t } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useProjectDispatch,
  useProjectSelector,
  useProjectStore,
} from '../redux/hooks'

import { PV_V2 } from 'constants/pv'
import { useProjectLogoSrc } from 'hooks/useProjectLogoSrc'
import { useJBTokenContext } from 'juice-sdk-react'
import { V4_CURRENCY_ETH } from 'packages/v4/utils/currency'
import { projectCartActions } from '../redux/projectCartSlice'
import { EthereumLogo } from './EthereumLogo'
import { PayRedeemInput } from './PayRedeemInput'
import { PreventOverspendingPayCard } from './PreventOverspendingPayCard'
// import { usePayProjectDisabled } from 'packages/v2v3/hooks/usePayProjectDisabled'
import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useWallet } from 'hooks/Wallet'
import { useV4NftRewards } from 'packages/v4/contexts/V4NftRewards/V4NftRewardsProvider'
import { useProjectPaymentTokens } from './PayProjectModal/hooks/useProjectPaymentTokens'

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
  // const { payDisabled, message } = usePayProjectDisabled()
  const { token } = useJBTokenContext()
  const wallet = useWallet()
  const { isConnected: walletConnected, connect } = useWallet()
  const { projectId, projectMetadata } = useProjectMetadataContext()
  const tokenReceivedAmount = useProjectPaymentTokens()
  const chosenNftRewards = useProjectSelector(
    state => state.projectCart.chosenNftRewards,
  )
  const {
    nftRewards: { rewardTiers, flags: { preventOverspending } },
  } = useV4NftRewards()

  const cartPayAmount = useProjectSelector(
    state => state.projectCart.payAmount?.amount,
  )
  const dispatch = useProjectDispatch()
  const store = useProjectStore()

  const tokenLogo = useProjectLogoSrc({
    projectId,
    pv: PV_V2,
    uri: projectMetadata?.logoUri,
  })

  const [payAmount, setPayAmount] = useState<string>()
  const [fallbackImage, setFallbackImage] = useState<boolean>()

  const tokenBSymbol = token?.data?.symbol // the token the user receives (the project token)

  const amount = cartPayAmount ?? 0
  const insufficientBalance = !wallet.balance
    ? false
    : amount > parseFloat(wallet.balance)
  const tokenBTicker = tokenBSymbol || 'TOKENS'

  const handleUserPayAmountChange = useCallback(
    (value: string | undefined) => {
      const parsedValue = parseFloat(value || '0')
      dispatch(
        projectCartActions.addPayment({
          amount: !Number.isNaN(parsedValue) ? parsedValue : 0,
          currency: V4_CURRENCY_ETH,
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
    return insufficientBalance || cartPayAmount === 0 || !cartPayAmount
  }, [cartPayAmount, insufficientBalance, walletConnected])
  const message = undefined

  return (
    <div>
      <div className="relative">
        <div className="flex flex-col gap-y-2">
          { rewardTiers?.length && preventOverspending ? (
            <PreventOverspendingPayCard />
          ): (
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
          />
          <PayRedeemInput
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
                  '🧃'
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
          </>)}
        </div>
      </div>

      <Tooltip className="w-full flex-1" title={message}>
        <Button
          style={{ display: 'block', width: '100%' }}
          type="primary"
          className="mt-6"
          size="large"
          disabled={payButtonDisabled}
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
