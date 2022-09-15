import useSubgraphQuery from 'hooks/SubgraphQuery'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'

import { FEATURE_FLAGS } from 'constants/featureFlags'
import { VeNftContext } from 'contexts/veNftContext'

export const useVeNftUserTokens = () => {
  const { contractAddress } = useContext(VeNftContext)
  const { userAddress } = useWallet()
  return useSubgraphQuery(
    {
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
    },
    {
      enabled: featureFlagEnabled(FEATURE_FLAGS.VENFT),
    },
  )
}
