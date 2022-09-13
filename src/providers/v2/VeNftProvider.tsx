import { V2ProjectContext } from 'contexts/v2/projectContext'
import { VeNftContext } from 'contexts/veNftContext'
import { useVeNftBaseImagesHash } from 'hooks/veNft/VeNftBaseImagesHash'
import { useVeNftLockDurationOptions } from 'hooks/veNft/VeNftLockDurationOptions'
import { useVeNftName } from 'hooks/veNft/VeNftName'
import { useVeNftResolverAddress } from 'hooks/veNft/VeNftResolverAddress'
import { useVeNftUserTokens } from 'hooks/veNft/VeNftUserTokens'
import { useVeNftVariants } from 'hooks/veNft/VeNftVariants'
import { useContext } from 'react'

export const VeNftProvider: React.FC = ({ children }) => {
  const {
    veNft: { contractAddress },
  } = useContext(V2ProjectContext)
  const { data: name } = useVeNftName()
  const { data: lockDurationOptions } = useVeNftLockDurationOptions()
  const baseImagesHash = useVeNftBaseImagesHash()
  const { data: resolverAddress } = useVeNftResolverAddress()
  const { data: variants } = useVeNftVariants()
  const { data: userTokens } = useVeNftUserTokens()

  return (
    <VeNftContext.Provider
      value={{
        name,
        lockDurationOptions,
        baseImagesHash,
        contractAddress,
        resolverAddress,
        variants,
        userTokens,
      }}
    >
      {children}
    </VeNftContext.Provider>
  )
}
