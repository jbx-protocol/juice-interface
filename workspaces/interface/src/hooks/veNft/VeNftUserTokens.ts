import { V2ProjectContext } from 'contexts/v2/projectContext'
import useSubgraphQuery from 'hooks/SubgraphQuery'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'

import { FEATURE_FLAGS } from 'constants/featureFlags'

export const useVeNftUserTokens = () => {
  const {
    veNft: { contractAddress },
  } = useContext(V2ProjectContext)
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
