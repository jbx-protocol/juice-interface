import { usePrivy, useWallets } from '@privy-io/react-auth'
import { Button } from 'antd'
import { PrivyContext } from 'components/Privy'
import { PayProjectModalFormValues } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/usePayProjectModal/usePayProjectModal'
import { readNetwork } from 'constants/networks'
import { DEFAULT_MIN_RETURNED_TOKENS } from 'constants/transactionDefaults'
import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { useFormikContext } from 'formik'
import { useWallet } from 'hooks/Wallet'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useProjectHasErc20 } from 'hooks/v2v3/useProjectHasErc20'
import { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import { buildPaymentMemo } from 'utils/buildPaymentMemo'
import { parseWad } from 'utils/format/formatNumber'
import { emitErrorNotification } from 'utils/notifications'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { usePrepareDelegatePayMetadata } from '../../../hooks/usePayProjectModal/usePrepareDelegatePayMetadata'
import { useProjectCart } from '../../../hooks/useProjectCart'
import { useProjectPageQueries } from '../../../hooks/useProjectPageQueries'
import { useProjectPaymentTokens } from '../../../hooks/useProjectPaymentTokens'

export type PayWithCardProps = {
  className?: string
}

export const PayWithCard: React.FC<PayWithCardProps> = ({ className }) => {
  const { addLoginHandler, removeLoginHandler } = useContext(PrivyContext)
  const { projectId } = useContext(ProjectMetadataContext)
  const { contracts } = useContext(V2V3ProjectContractsContext)
  const { values, submitForm } = useFormikContext<PayProjectModalFormValues>()
  const {
    nftRewards: { rewardTiers },
  } = useContext(NftRewardsContext)

  const [userJustLoggedIn, setUserJustLoggedIn] = useState(false)

  const { login, ready, authenticated, sendTransaction } = usePrivy()
  const { wallets } = useWallets()
  const { totalAmount, nftRewards, dispatch } = useProjectCart()
  const converter = useCurrencyConverter()
  const { userAddress } = useWallet()
  const projectHasErc20 = useProjectHasErc20()
  const { receivedTickets } = useProjectPaymentTokens()
  const { setProjectPayReceipt } = useProjectPageQueries()

  const weiAmount = useMemo(() => {
    if (!totalAmount) {
      return parseWad(0)
    } else if (totalAmount.currency === V2V3_CURRENCY_ETH) {
      return parseWad(totalAmount.amount)
    } else {
      return converter.usdToWei(totalAmount.amount)
    }
  }, [totalAmount, converter])

  const prepareDelegateMetadata = usePrepareDelegatePayMetadata(weiAmount, {
    nftRewards,
    receivedTickets,
  })

  const constructDataPayload = useCallback(() => {
    const pidString = padLeft((projectId ?? 0).toString(16))
    const weiString = padLeft(weiAmount.toHexString().substring(2))
    const tokenAddress = padLeft(ETH_TOKEN_ADDRESS.substring(2))
    const privyWallet = wallets.find(
      wallet => wallet.walletClientType === 'privy',
    )
    const beneficiaryAddress = values.beneficiaryAddress
      ? padLeft(values.beneficiaryAddress.substring(2))
      : userAddress
      ? padLeft(userAddress.substring(2))
      : // Final fallback is to send to privy wallet
      privyWallet?.address
      ? padLeft(privyWallet.address.substring(2))
      : '0'.repeat(64)
    const minReturnedToken = padLeft(DEFAULT_MIN_RETURNED_TOKENS.toString())
    const preferClaimedTokens = padLeft(projectHasErc20 ? '1' : '0')

    const { messageString, attachedUrl } = values.message
    const memo = buildPaymentMemo({
      text: messageString,
      imageUrl: attachedUrl,
      nftUrls: nftRewards
        .map(
          ({ id }) =>
            (rewardTiers ?? []).find(({ id: tierId }) => tierId === id)
              ?.fileUrl,
        )
        .filter((url): url is string => !!url),
    })

    const encodedMemo = encodeString(memo)
    const delegateMetadata = prepareDelegateMetadata()?.substring(2)
    const delegateMetadataLength =
      // 2 hex characters represent 1 byte
      ((delegateMetadata?.length ?? 0) / 2).toString(16)
    const encodedMetadata = delegateMetadata
      ? padLeft(delegateMetadataLength) + delegateMetadata
      : encodeNumber(0)

    // Calculate offsets
    const memoOffset = padLeft((8 * 32).toString(16)) // 9 static parameters * 32 bytes each
    const metadataOffset = padLeft(
      (8 * 32 + encodedMemo.length / 2).toString(16),
    ) // memo length in bytes added

    const data =
      '0x1ebc263f' + // function selector for pay
      pidString +
      weiString +
      tokenAddress +
      beneficiaryAddress +
      minReturnedToken +
      preferClaimedTokens +
      memoOffset +
      metadataOffset +
      encodedMemo +
      encodedMetadata
    return data
  }, [
    nftRewards,
    prepareDelegateMetadata,
    projectHasErc20,
    projectId,
    rewardTiers,
    userAddress,
    values.beneficiaryAddress,
    values.message,
    wallets,
    weiAmount,
  ])

  const buildPayReceipt = useCallback(
    (hash: string) => {
      const privyWallet = wallets.find(
        wallet => wallet.walletClientType === 'privy',
      )
      return {
        totalAmount: totalAmount ?? {
          amount: 0,
          currency: V2V3_CURRENCY_ETH,
        },
        nfts: nftRewards,
        timestamp: new Date(),
        transactionHash: hash,
        fromAddress: privyWallet?.address ?? '???',
        tokensReceived: receivedTickets ?? '',
      }
    },
    [nftRewards, receivedTickets, totalAmount, wallets],
  )

  const privyPay = useCallback(async () => {
    const data = constructDataPayload()

    try {
      const res = await sendTransaction({
        to: contracts.JBETHPaymentTerminal?.address,
        chainId: readNetwork.chainId,
        data,
        value: weiAmount.toBigInt(),
        gasLimit: 1000000,
        gasPrice: 1000000000,
      })
      dispatch({ type: 'payProject' })
      dispatch({ type: 'closePayModal' })
      setProjectPayReceipt(buildPayReceipt(res.transactionHash))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error)
      emitErrorNotification(error?.message ?? 'Could not pay')
    }
  }, [
    buildPayReceipt,
    constructDataPayload,
    contracts.JBETHPaymentTerminal?.address,
    dispatch,
    sendTransaction,
    setProjectPayReceipt,
    weiAmount,
  ])

  const handlePayWithCard = useCallback(async () => {
    if (!values.userAcceptsTerms) {
      // Hack to get the checkbox to show errors
      submitForm()
      return
    }
    if (!ready) return
    if (!authenticated) {
      login()
      return
    }
    await privyPay()
  }, [
    authenticated,
    login,
    privyPay,
    ready,
    submitForm,
    values.userAcceptsTerms,
  ])

  useEffect(() => {
    const handlerId = addLoginHandler(() => setUserJustLoggedIn(true))
    return () => removeLoginHandler(handlerId)
  }, [addLoginHandler, removeLoginHandler])

  useEffect(() => {
    if (userJustLoggedIn) {
      setUserJustLoggedIn(false)
      privyPay()
    }
  }, [privyPay, userJustLoggedIn])

  return (
    <Button
      className={twMerge('w-full', className)}
      onClick={handlePayWithCard}
    >
      Pay with card
    </Button>
  )
}

function padLeft(data: string, length = 64): string {
  return data.padStart(length, '0')
}

function padRight(data: string, length = 64): string {
  return data.padEnd(length, '0')
}

function encodeString(str: string): string {
  const length = str.length.toString(16)
  const strHex = Buffer.from(str, 'utf8').toString('hex')
  return (
    padLeft(length) +
    padRight(strHex, strHex.length + (64 - (strHex.length % 64)))
  )
}
function encodeNumber(num: number): string {
  const length = num === 0 ? (1).toString(16) : num.toString(16)
  const numHex = num.toString(16)
  return (
    padLeft(length) +
    padLeft(numHex, numHex.length + (64 - (numHex.length % 64)))
  )
}
