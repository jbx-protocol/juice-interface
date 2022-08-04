import { useAccount } from 'wagmi'
import useSubgraphQuery from 'hooks/SubgraphQuery'

export const useVeNftUserTokens = () => {
  const { address: userAddress } = useAccount()
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
