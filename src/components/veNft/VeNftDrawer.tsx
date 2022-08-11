import { Drawer, DrawerProps } from 'antd'

import { useContext, useMemo } from 'react'

import VeNftContent from 'components/veNft/VeNftContent'

import { VeNftContext, VeNftContextType } from 'contexts/v2/veNftContext'
import { useVeNftBaseImagesHash } from 'hooks/veNft/VeNftBaseImagesHash'
import { useVeNftLockDurationOptions } from 'hooks/veNft/VeNftLockDurationOptions'
import { useVeNftUserTokens } from 'hooks/veNft/VeNftUserTokens'
import { useVeNftVariants } from 'hooks/veNft/VeNftVariants'

import { useVeNftName } from 'hooks/veNft/VeNftName'

import { V2ProjectContext } from 'contexts/v2/projectContext'

import { drawerStyle } from 'constants/styles/drawerStyle'

export function VeNftDrawer({
  visible,
  onClose,
}: {
  visible: boolean
  onClose: VoidFunction
}) {
  const {
    veNft: { contractAddress, uriResolver },
  } = useContext(V2ProjectContext)
  const { data: name } = useVeNftName()
  const { data: lockDurationOptions } = useVeNftLockDurationOptions()
  const { data: variants } = useVeNftVariants()
  const { data: userTokens } = useVeNftUserTokens()
  const baseImagesHash = useVeNftBaseImagesHash()
  const memoizedDrawerStyle: Partial<DrawerProps> = useMemo(
    () => drawerStyle,
    [],
  )

  const veNft: VeNftContextType = {
    name,
    lockDurationOptions,
    contractAddress,
    resolverAddress: uriResolver,
    variants,
    userTokens,
    baseImagesHash,
  }

  return (
    <Drawer
      {...memoizedDrawerStyle}
      visible={visible}
      onClose={onClose}
      destroyOnClose
    >
      <VeNftContext.Provider value={veNft}>
        <VeNftContent />
      </VeNftContext.Provider>
    </Drawer>
  )
}
