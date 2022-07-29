import { Drawer, DrawerProps } from 'antd'

import { useMemo } from 'react'

import VeNftContent from 'components/veNft/VeNftContent'

import { VeNftContext, VeNftContextType } from 'contexts/v2/veNftContext'
import { useVeNftBaseImagesHash } from 'hooks/veNft/VeNftBaseImagesHash'
import { useVeNftLockDurationOptions } from 'hooks/veNft/VeNftLockDurationOptions'
import { useVeNftResolverAddress } from 'hooks/veNft/VeNftResolverAddress'
import { useVeNftUserTokens } from 'hooks/veNft/VeNftUserTokens'
import { useVeNftVariants } from 'hooks/veNft/VeNftVariants'

import { useVeNftName } from 'hooks/veNft/VeNftName'

import { drawerStyle } from 'constants/styles/drawerStyle'

export function VeNftDrawer({
  visible,
  onClose,
}: {
  visible: boolean
  onClose: VoidFunction
}) {
  const { data: name } = useVeNftName()
  const { data: lockDurationOptions } = useVeNftLockDurationOptions()
  const { data: resolverAddress } = useVeNftResolverAddress()
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
    resolverAddress,
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
