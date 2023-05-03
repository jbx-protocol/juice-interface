import EthereumAddress from 'components/EthereumAddress'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext } from 'react'
import AddERC20ToWalletButton from './AddERC20ToWalletButton'

export function ProjectTokenDescription() {
  const { tokenSymbol, tokenAddress } = useContext(V2V3ProjectContext)

  return (
    <div>
      {tokenSymbol} (
      <EthereumAddress address={tokenAddress} />)
      <AddERC20ToWalletButton />
    </div>
  )
}
