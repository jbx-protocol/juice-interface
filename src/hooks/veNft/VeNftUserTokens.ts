import { useWallet } from 'hooks/Wallet'
import useSubgraphQuery from 'hooks/SubgraphQuery'

export const useVeNftUserTokens = () => {
  const { userAddress } = useWallet()
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
