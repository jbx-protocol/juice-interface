// import { CheckCircleIcon } from '@heroicons/react/24/outline'
// import { t, Trans } from '@lingui/macro'
// import { Button, Tooltip } from 'antd'
// import Loading from 'components/Loading'
// import { JuiceModal, JuiceModalProps } from 'components/modals/JuiceModal'
// import { PV_V2 } from 'constants/pv'
// import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
// import { useProjectLogoSrc } from 'hooks/useProjectLogoSrc'
// import { useWallet } from 'hooks/Wallet'
// import { useJBTokenContext } from 'juice-sdk-react'
// import { useETHReceivedFromTokens } from 'packages/v2v3/hooks/contractReader/useETHReceivedFromTokens'
// import { useRedeemTokensTx } from 'packages/v2v3/hooks/transactor/useRedeemTokensTx'
// import { usePayoutLimit } from 'packages/v4/hooks/usePayoutLimit'
// import { V4_CURRENCY_USD } from 'packages/v4/utils/currency'
// import { useCallback, useMemo, useState } from 'react'
// import { formatAmount } from 'utils/format/formatAmount'
// import { fromWad, parseWad } from 'utils/format/formatNumber'
// import { emitErrorNotification } from 'utils/notifications'
// import { EthereumLogo } from './EthereumLogo'
// import { PayRedeemInput } from './PayRedeemInput'

// type RedeemConfigurationProps = {
//   userTokenBalance: number | undefined
//   projectHasErc20Token: boolean
// }

// export const RedeemConfiguration: React.FC<RedeemConfigurationProps> = ({
//   userTokenBalance,
//   projectHasErc20Token,
// }) => {
//   const { token } = useJBTokenContext()
//   const tokenSymbol = token?.data?.symbol
//   const { data: payoutLimit } = usePayoutLimit()
//   const { projectId, projectMetadata } = useProjectMetadataContext()
//   const redeemTokensTx = useRedeemTokensTx()
//   const wallet = useWallet()
//   // TODO: We should probably break out tokens panel hook into reusable module
//   const tokenLogo = useProjectLogoSrc({
//     projectId,
//     pv: PV_V2,
//     uri: projectMetadata?.logoUri,
//   })

//   const [redeemAmount, setRedeemAmount] = useState<string>()
//   const [fallbackImage, setFallbackImage] = useState<boolean>()
//   const [modalOpen, setModalOpen] = useState(false)
//   const [redeeming, setRedeeming] = useState(false)

//   const ethReceivedFromTokens = useETHReceivedFromTokens({
//     tokenAmount: redeemAmount,
//   })

//   const tokenFromRedeemAmount = useMemo(() => {
//     if (!redeemAmount) return ''
//     return formatAmount(fromWad(ethReceivedFromTokens))
//   }, [ethReceivedFromTokens, redeemAmount])

//   const insufficientBalance = useMemo(() => {
//     if (!userTokenBalance) return false
//     const amount = Number(redeemAmount || 0)
//     const balance = userTokenBalance ?? 0
//     return amount > balance
//   }, [redeemAmount, userTokenBalance])
//   const tokenTicker = tokenSymbol || 'TOKENS'

//   // 0.5% slippage for USD-denominated tokens
//   const slippage = useMemo(() => {
//     if (payoutLimit?.currency === V4_CURRENCY_USD) {
//       return ethReceivedFromTokens?.mul(1000).div(1005)
//     }
//     return ethReceivedFromTokens
//   }, [payoutLimit?.currency, ethReceivedFromTokens])

//   const redeem = useCallback(async () => {
//     if (!slippage) {
//       emitErrorNotification('Failed to calculate slippage')
//       return
//     }
//     setRedeeming(true)
//     const txSuccess = await redeemTokensTx(
//       {
//         redeemAmount: parseWad(redeemAmount),
//         minReturnedTokens: slippage,
//         memo: '',
//       },
//       {
//         onDone: () => {
//           setModalOpen(true)
//         },
//         onConfirmed: () => {
//           setRedeeming(false)
//         },
//         onError: (e: Error) => {
//           setRedeeming(false)
//           setModalOpen(false)
//           emitErrorNotification(e.message)
//         },
//       },
//     )
//     if (!txSuccess) {
//       setRedeeming(false)
//       setModalOpen(false)
//     }
//   }, [redeemAmount, redeemTokensTx, slippage])

//   return (
//     <>
//       <div>
//         <div className="relative">
//           <div className="flex flex-col gap-y-2">
//             <PayRedeemInput
//               label={
//                 <Tooltip
//                   title={t`Redeem your tokens for a portion of this project's treasury`}
//                 >
//                   {t`You redeem`}
//                 </Tooltip>
//               }
//               token={{
//                 balance: userTokenBalance?.toString(),
//                 image:
//                   tokenLogo && !fallbackImage ? (
//                     <img
//                       src={tokenLogo}
//                       alt="Token logo"
//                       onError={() => setFallbackImage(true)}
//                     />
//                   ) : (
//                     '🧃'
//                   ),
//                 ticker: tokenTicker,
//                 type: projectHasErc20Token ? 'erc20' : 'native',
//               }}
//               value={redeemAmount}
//               onChange={setRedeemAmount}
//             />
//             <PayRedeemInput
//               label={t`You receive`}
//               downArrow
//               readOnly
//               token={{
//                 balance: wallet.balance,
//                 image: <EthereumLogo />,
//                 ticker: 'ETH',
//                 type: 'eth',
//               }}
//               value={tokenFromRedeemAmount}
//             />
//           </div>
//         </div>

//         <Button
//           type="primary"
//           className="mt-6 w-full"
//           size="large"
//           loading={redeeming}
//           disabled={
//             insufficientBalance || redeemAmount === '0' || !redeemAmount
//           }
//           onClick={redeem}
//         >
//           {wallet.isConnected ? (
//             insufficientBalance ? (
//               <Trans>Insufficient balance</Trans>
//             ) : (
//               <Trans>Redeem {tokenTicker}</Trans>
//             )
//           ) : (
//             <Trans>Connect wallet to redeem</Trans>
//           )}
//         </Button>
//       </div>
//       <RedeemModal
//         open={modalOpen}
//         setOpen={setModalOpen}
//         redeeming={redeeming}
//       />
//     </>
//   )
// }

// const RedeemModal: React.FC<JuiceModalProps & { redeeming: boolean }> = ({
//   redeeming,
//   ...props
// }) => {
//   return (
//     <JuiceModal {...props} hideCancelButton hideOkButton>
//       <div className="mx-auto flex flex-col items-center justify-center">
//         {redeeming ? (
//           <>
//             <Loading />
//             <h2 className="mt-8">
//               <Trans>Redeeming tokens</Trans>
//             </h2>
//             <div>
//               <Trans>Your transaction is processing.</Trans>
//             </div>
//             <div>
//               <Trans>You can safely close this modal.</Trans>
//             </div>
//           </>
//         ) : (
//           <>
//             <div className="flex h-20 w-20 items-center justify-center rouncded-full bg-melon-100 dark:bg-melon-950">
//               <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-melon-200 dark:bg-melon-900">
//                 <CheckCircleIcon className="h-10 w-10 text-melon-700 dark:text-melon-500" />
//               </div>
//             </div>
//             <h2 className="mt-4">
//               <Trans>Success!</Trans>
//             </h2>
//             <div>
//               <Trans>Your transaction was successful.</Trans>
//             </div>
//             <div>
//               <Trans>You can safely close this modal.</Trans>
//             </div>
//           </>
//         )}

//         {/* <ExternalLink className="mt-3">View on block explorer</ExternalLink> */}
//       </div>
//     </JuiceModal>
//   )
// }
