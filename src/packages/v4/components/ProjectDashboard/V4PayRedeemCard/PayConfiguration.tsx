import { t, Trans } from '@lingui/macro'
import { Button, Tooltip } from 'antd'
import { PV_V2 } from 'constants/pv'
import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useProjectLogoSrc } from 'hooks/useProjectLogoSrc'
import { useWallet } from 'hooks/Wallet'
import { useJBTokenContext } from 'juice-sdk-react'
import { usePayProjectDisabled } from 'packages/v2v3/hooks/usePayProjectDisabled'
import { V4_CURRENCY_ETH } from 'packages/v4/utils/currency'
import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  useProjectDispatch,
  useProjectSelector,
  useProjectStore,
} from '../redux/hooks'
import { projectCartActions } from '../redux/projectCartSlice'
import { EthereumLogo } from './EthereumLogo'
import { useProjectPaymentTokens } from './PayProjectModal/hooks/useProjectPaymentTokens'
import { PayRedeemInput } from './PayRedeemInput'

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
  const { payDisabled, message } = usePayProjectDisabled()
  const { token } = useJBTokenContext()
  const wallet = useWallet()
  const { isConnected: walletConnected, connect } = useWallet()
  const { projectId, projectMetadata } = useProjectMetadataContext()
  const tokenReceivedAmount = useProjectPaymentTokens()
  const chosenNftRewards = useProjectSelector(
    state => state.projectCart.chosenNftRewards,
  )
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

  const payButtonDisabled = useMemo(() => {
    if (!walletConnected) return false
    return (
      insufficientBalance ||
      cartPayAmount === 0 ||
      !cartPayAmount ||
      payDisabled
    )
  }, [cartPayAmount, insufficientBalance, payDisabled, walletConnected])

  return (
    <div>
      <div className="relative">
        <div className="flex flex-col gap-y-2">
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
            nfts={chosenNftRewards}
            value={
              tokenReceivedAmount.receivedTickets &&
              !!parseFloat(tokenReceivedAmount.receivedTickets)
                ? tokenReceivedAmount.receivedTickets
                : ''
            }
          />
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
