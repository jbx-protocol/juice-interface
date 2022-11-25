import { GnosisSafe, SafeTransactionType } from 'models/safe'
import { CheckOutlined } from '@ant-design/icons'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { Button, Tooltip } from 'antd'
import axios from 'axios'
import { t } from '@lingui/macro'

export function SignSafeTxButton({
  safe,
  transaction,
}: {
  safe: GnosisSafe
  transaction: SafeTransactionType
}) {
  const { projectOwnerAddress } = useContext(V2V3ProjectContext)

  const { userAddress } = useWallet()

  const userCanSign = userAddress
    ? safe?.owners?.some(
        ownerAddress => ownerAddress.toLowerCase() === userAddress,
      )
    : false

  if (!userCanSign) return null

  const userHasSigned = userAddress
    ? transaction.confirmations?.some(
        sig => sig.owner.toLowerCase() === userAddress,
      )
    : false

  // safe wallet cannot sign its own transactions
  const isOwner = projectOwnerAddress === userAddress

  const signTx = async () => {
    // console.log('signing::')
    // console.log('   url: ', `https://safe-transaction.gnosis.io/api/v1/multisig-transactions/${transaction.safeTxHash}/confirmations`)
    // console.log('   data: ', {
    // signature: userAddress
    // })
    const res = await axios.post(
      `https://safe-transaction.gnosis.io/api/v1/multisig-transactions/${transaction.safeTxHash}/confirmations`,
      {
        signature: userAddress,
      },
    )
    console.info('sign tx res: ', res)
  }
  // https://safe-client.safe.global/v1/chains/1/transactions/multisig_0x07f356Fdb3EA88Fad8607A58434b35F528Ce9b1b_0x5859a850e8f3ece11de0c325c5813d6fff6f66038d5ca0402784500933bea832
  const _button = (
    <Button
      icon={<CheckOutlined />}
      disabled={userHasSigned || isOwner || !userAddress}
      onClick={e => {
        e.stopPropagation()
        signTx()
      }}
    />
  )

  if (userHasSigned) {
    return (
      <Tooltip title={t`You have already signed this transaction.`}>
        {_button}
      </Tooltip>
    )
  }
  return _button
}
