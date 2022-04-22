import { Trans } from '@lingui/macro'
import { Drawer } from 'antd'

import { drawerStyle } from 'constants/styles/drawerStyle'

export function V2StakeForNFTDrawer({
  visible,
  onClose,
}: {
  visible: boolean
  onClose: VoidFunction
}) {
  return (
    <Drawer visible={visible} {...drawerStyle} onClose={onClose}>
      <h3>
        <Trans>Stake for NFT</Trans>
      </h3>
      <br />
      Stake for NFT
    </Drawer>
  )
}
