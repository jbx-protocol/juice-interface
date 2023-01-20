// import { Trans } from '@lingui/macro'
// import { Form, ModalProps, Space } from 'antd'
// import TransactionModal from 'components/TransactionModal'
// import { useWallet } from 'hooks/Wallet'
// import { useContext, useState } from 'react'
// import { parseWad } from 'utils/format/formatNumber'
// import { V2V3ContractsContext } from 'contexts/v2v3/V2V3ContractsContext'
// import { useV1HasPermissions } from 'hooks/v1/contractReader/V1HasPermissions'
// import { V1OperatorPermission } from 'models/v1/permissions'
// import { GrantTransferPermissionCallout } from './GrantApprovalCallout'
// import { MigrateLegacyProjectTokensForm } from './MigrateLegacyProjectTokensForm'
// import { TokenSwapDescription } from './TokenSwapDescription'

// export function MigrateProjectTokensModal({
//   legacyTokenBalance,
//   ...props
// }: {
//   legacyTokenBalance: number | undefined
// } & ModalProps) {
//   const { userAddress } = useWallet()
//   const { contracts } = useContext(V2V3ContractsContext)

//   const [loading, setLoading] = useState<boolean>(false)
//   const [transactionPending, setTransactionPending] = useState<boolean>(false)
//   const [permissionGranted, setPermissionGranted] = useState<boolean>(false)

//   const [form] = Form.useForm<{ tokenAmount: string }>()

//   const operator = '' // TODO
//   const hasV1TokenTransferPermission =
//     useV1HasPermissions({
//       operator,
//       domain: 0,
//       account: userAddress,
//       permissionIndexes: [V1OperatorPermission.Transfer],
//     }) || permissionGranted
//   const payV1TokenPaymentTerminalTx = usePayV1TokenPaymentTerminal()

//   const swapTokens = async () => {
//     await form.validateFields()
//     setLoading(true)

//     const tokenAmount = form.getFieldValue('tokenAmount')

//     const txSuccess = await payV1TokenPaymentTerminalTx(
//       {
//         memo: '',
//         preferClaimedTokens: false,
//         beneficiary: userAddress,
//         value: parseWad(tokenAmount),
//       },
//       {
//         onConfirmed() {
//           setLoading(false)
//           setTransactionPending(false)

//           window.location.reload()
//         },
//         onDone() {
//           setTransactionPending(true)
//         },
//       },
//     )

//     if (!txSuccess) {
//       setLoading(false)
//       setTransactionPending(false)
//     }
//   }

//   const modalOkProps = () => {
//     return !hasV1TokenTransferPermission
//       ? {
//           okButtonProps: { hidden: true },
//         }
//       : {
//           onOk: () => form.submit(),
//           okText: (
//             <span>
//               <Trans>Swap for V3 tokens</Trans>
//             </span>
//           ),
//         }
//   }

//   return (
//     <TransactionModal
//       title={<Trans>Swap legacy tokens for V3 tokens</Trans>}
//       transactionPending={transactionPending}
//       confirmLoading={loading}
//       destroyOnClose
//       {...modalOkProps()}
//       {...props}
//     >
//       <Space size="large" direction="vertical" className="w-full">
//         {!hasV1TokenTransferPermission && (
//           <GrantTransferPermissionCallout
//             onFinish={() => setPermissionGranted(true)}
//           />
//         )}
//         <TokenSwapDescription />

//         {hasV1TokenTransferPermission && (
//           <MigrateLegacyProjectTokensForm
//             form={form}
//             onFinish={() => swapTokens()}
//             legacyTokenBalance={legacyTokenBalance}
//           />
//         )}
//       </Space>
//     </TransactionModal>
//   )
// }
