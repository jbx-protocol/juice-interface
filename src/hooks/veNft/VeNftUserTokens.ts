import { NetworkContext } from 'contexts/networkContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { useContext } from 'react'

export const useVeNftUserTokens = () => {
  const { userAddress } = useContext(NetworkContext)
  return useSubgraphQuery({
    entity: 'veNftToken',
    keys: [
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
    ],
  })
}
