import { useWallet } from 'hooks/Wallet'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { useContext } from 'react'
import { V2ProjectContext } from 'contexts/v2/projectContext'

export const useVeNftUserTokens = () => {
  const { userAddress } = useWallet()
  const {
    veNft: { contractAddress },
  } = useContext(V2ProjectContext)
  return useSubgraphQuery({
    entity: 'veNftToken',
    keys: [
      'contractAddress',
      'tokenId',
      'tokenUri',
      'owner',
      'lockAmount',
      'lockDuration',
      'lockEnd',
      'lockUseJbToken',
      'lockAllowPublicExtension',
      'createdAt',
      'unlockedAt',
      'redeemedAt',
    ],
    where: [
      {
        key: 'owner',
        value: userAddress || '',
      },
      {
        key: 'contractAddress',
        value: contractAddress || '',
      },
    ],
  })
}
