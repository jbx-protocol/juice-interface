import { NetworkContext } from 'contexts/networkContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { useContext } from 'react'

export const useVeNftUserTokens = () => {
  const {
    veNft: { contractAddress },
  } = useContext(V2ProjectContext)
  const { userAddress } = useContext(NetworkContext)
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
