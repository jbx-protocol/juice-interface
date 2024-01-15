import { usePrivy, useWallets } from '@privy-io/react-auth'
import { Button } from 'antd'
import { PrivyContext } from 'components/Privy'
import { PayProjectModalFormValues } from 'components/v2v3/V2V3Project/ProjectDashboard/hooks/usePayProjectModal/usePayProjectModal'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { readNetwork } from 'constants/networks'
import { DEFAULT_MIN_RETURNED_TOKENS } from 'constants/transactionDefaults'
import { ETH_TOKEN_ADDRESS } from 'constants/v2v3/juiceboxTokens'
import { NftRewardsContext } from 'contexts/NftRewards/NftRewardsContext'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContractsContext } from 'contexts/v2v3/ProjectContracts/V2V3ProjectContractsContext'
import { useFormikContext } from 'formik'
import { useWallet } from 'hooks/Wallet'
import { useCurrencyConverter } from 'hooks/useCurrencyConverter'
import { useGasPrice } from 'hooks/useGasPrice'
import { useProjectHasErc20 } from 'hooks/v2v3/useProjectHasErc20'
import { NetworkName } from 'models/networkName'
import {
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { twMerge } from 'tailwind-merge'
import { buildPaymentMemo } from 'utils/buildPaymentMemo'
import { featureFlagEnabled } from 'utils/featureFlags'
import { parseWad } from 'utils/format/formatNumber'
import {
  emitErrorNotification,
  emitInfoNotification,
} from 'utils/notifications'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { usePrepareDelegatePayMetadata } from '../../../hooks/usePayProjectModal/usePrepareDelegatePayMetadata'
import { useProjectCart } from '../../../hooks/useProjectCart'
import { useProjectPageQueries } from '../../../hooks/useProjectPageQueries'
import { useProjectPaymentTokens } from '../../../hooks/useProjectPaymentTokens'

const AllowedProjects: Record<NetworkName, number[]> = {
  [NetworkName.mainnet]: [],
  [NetworkName.localhost]: [],
  [NetworkName.goerli]: [],
}
const AllowedNetworks: NetworkName[] = [NetworkName.goerli]

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
  const { gasPriceWei, estimateGas } = useGasPrice()

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

    const gasLimit = await estimateGas({
      to: contracts.JBETHPaymentTerminal?.address,
      chainId: readNetwork.chainId,
      data,
      value: weiAmount.toBigInt(),
      gasPrice: gasPriceWei,
    })

    try {
      const res = await sendTransaction({
        to: contracts.JBETHPaymentTerminal?.address,
        chainId: readNetwork.chainId,
        data,
        value: weiAmount.toBigInt(),
        gasLimit: gasLimit.toBigInt(),
        gasPrice: gasPriceWei.toBigInt(),
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
    estimateGas,
    gasPriceWei,
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

  const networkIsAllowed = AllowedNetworks.includes(readNetwork.name)
  const projectIsAllowed = AllowedProjects[readNetwork.name].includes(
    projectId ?? -1,
  )

  if (!(networkIsAllowed || projectIsAllowed)) {
    return null
  }

  return (
    <Button
      className={twMerge(
        'flex w-full items-center justify-center gap-2',
        className,
      )}
      onClick={handlePayWithCard}
    >
      Pay with card
      <PrivyLogo />
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

export const PrivyTestComponent: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const { logout } = usePrivy()
  if (!featureFlagEnabled(FEATURE_FLAGS.PRIVY_DEBUG_TOOLS)) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {children}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          type="link"
          onClick={() => {
            logout()
            emitInfoNotification('Logged out')
          }}
        >
          Logout
        </Button>
      </div>
    </div>
  )
}

const PrivyLogo = () => (
  <svg className="h-4" viewBox="0 0 89 29" fill="none">
    <path
      d="M31.2586 22.8523C31.6095 22.8523 31.8966 22.563 31.8966 22.2094C31.8966 20.3444 31.8966 18.4795 31.8966 16.6145C33.0132 16.6145 34.1297 16.6145 35.2463 16.6145C39.1063 16.6145 41.9456 13.7537 41.9456 9.86436C41.9456 5.97502 39.1063 3.11426 35.2463 3.11426H29.504C29.1531 3.11426 28.866 3.40355 28.866 3.75713V22.2094C28.866 22.563 29.1531 22.8523 29.504 22.8523H31.2586ZM31.8966 13.5609C31.8966 11.0965 31.8966 8.6322 31.8966 6.16788C33.0132 6.16788 34.1297 6.16788 35.2463 6.16788C37.3518 6.16788 38.8192 7.67862 38.8192 9.86436C38.8192 12.0501 37.3518 13.5609 35.2463 13.5609C34.1297 13.5609 33.0132 13.5609 31.8966 13.5609Z"
      fill="#FF8271"
    ></path>
    <path
      d="M46.0807 22.8523C46.4317 22.8523 46.7188 22.563 46.7188 22.2094V14.495C46.7188 11.0878 48.9838 9.80209 51.504 9.80209H52.142C52.4929 9.80209 52.78 9.5128 52.78 9.15922V7.42348C52.78 7.0699 52.4929 6.78061 52.142 6.78061H51.504C47.6751 6.78061 46.3527 9.43775 46.3527 9.43775C46.3527 9.43775 46.3527 7.78077 46.3527 7.42348C46.3527 6.91625 46.0656 6.78061 45.7146 6.78061H44.4857C44.1347 6.78061 43.8476 7.0699 43.8476 7.42348V22.2094C43.8476 22.563 44.1347 22.8523 44.4857 22.8523H46.0807Z"
      fill="#FF8271"
    ></path>
    <path
      d="M56.8926 22.8523C57.2435 22.8523 57.5306 22.563 57.5306 22.2094V7.42348C57.5306 7.0699 57.2435 6.78061 56.8926 6.78061H55.2337C54.8828 6.78061 54.5957 7.0699 54.5957 7.42348V22.2094C54.5957 22.563 54.8828 22.8523 55.2337 22.8523H56.8926Z"
      fill="#FF8271"
    ></path>
    <path
      d="M67.4537 22.8523C67.7408 22.8523 67.9323 22.6916 68.0599 22.3701L73.5788 7.77706C73.6426 7.61634 73.7064 7.42348 73.7064 7.23062C73.7064 7.00561 73.4512 6.78061 73.0684 6.78061H71.0905C70.8034 6.78061 70.612 6.90918 70.4844 7.26276C69.1931 10.9977 66.5564 18.227 66.5564 18.227C66.5564 18.227 63.9309 11.0063 62.6366 7.26276C62.509 6.90918 62.3176 6.78061 62.0305 6.78061H60.0526C59.6698 6.78061 59.4146 7.00561 59.4146 7.26276C59.4146 7.42348 59.4784 7.61634 59.5422 7.77706L65.093 22.3701C65.2206 22.6916 65.412 22.8523 65.6991 22.8523H67.4537Z"
      fill="#FF8271"
    ></path>
    <path
      d="M80.6944 28.0002C80.9815 28.0002 81.173 27.8716 81.3006 27.518L88.7796 7.77706C88.8434 7.61634 88.9072 7.42348 88.9072 7.26276C88.9072 7.00561 88.652 6.78061 88.2692 6.78061H86.3232C86.0361 6.78061 85.8447 6.90918 85.7171 7.26276C84.5202 10.7008 81.9527 18.227 81.9527 18.227C81.9527 18.227 79.2059 10.7362 77.9012 7.26276C77.7736 6.90918 77.5822 6.78061 77.2951 6.78061H75.3491C74.9663 6.78061 74.7111 7.00561 74.7111 7.26276C74.7111 7.42348 74.7749 7.61634 74.8387 7.77706L80.1662 21.4058C80.23 21.5666 80.2619 21.663 80.2619 21.7273C80.2619 21.8237 80.23 21.888 80.1662 22.0809L78.4294 27.068C78.3656 27.2287 78.3337 27.3573 78.3337 27.4859C78.3337 27.743 78.557 28.0002 78.9718 28.0002H80.6944Z"
      fill="#FF8271"
    ></path>
    <path
      d="M20.8014 26.1132C20.8014 27.2803 16.3687 28.2264 10.9007 28.2264C5.43268 28.2264 1 27.2803 1 26.1132C1 24.9461 5.43268 24 10.9007 24C16.3687 24 20.8014 24.9461 20.8014 26.1132Z"
      fill="#FF8271"
    ></path>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M0.314011 16.7096C0.314011 20.121 3.45923 21.6507 6.53445 21.6603C13.7298 21.6603 21.6907 17.2375 21.6493 9.83582C21.6195 4.49953 16.7162 -0.0433445 10.914 0.000312066C5.39286 0.000312066 0.000364633 3.6052 0 8.51627C0 9.83515 0.756613 11.111 2.73444 11.2547C1.08535 12.8877 0.314011 14.8443 0.314011 16.7096ZM10.933 11.8868C12.0864 11.8868 13.0214 10.7633 13.0214 9.37736C13.0214 7.99144 12.0864 6.86792 10.933 6.86792C9.77961 6.86792 8.84461 7.99144 8.84461 9.37736C8.84461 10.7633 9.77961 11.8868 10.933 11.8868ZM16.9209 11.8868C18.0743 11.8868 19.0093 10.7633 19.0093 9.37736C19.0093 7.99144 18.0743 6.86793 16.9209 6.86793C15.7675 6.86793 14.8325 7.99144 14.8325 9.37736C14.8325 10.7633 15.7675 11.8868 16.9209 11.8868Z"
      fill="#FF8271"
    ></path>
  </svg>
)
