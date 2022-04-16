import { Trans } from '@lingui/macro'
import { Drawer } from 'antd'
import TokenTabContent from 'components/v2/V2Create/forms/TokenForm'

import { drawerStyle } from 'constants/styles/drawerStyle'
import { FundingDrawersSubtitles } from '..'

export function V2ReconfigureTokenDrawer({
  visible,
  onSave,
  onClose,
}: {
  visible: boolean
  onSave: VoidFunction
  onClose: VoidFunction
}) {
  return (
    <Drawer visible={visible} {...drawerStyle} onClose={onClose}>
      <h3>
        <Trans>Reconfigure token</Trans>
      </h3>
      {FundingDrawersSubtitles}
      <br />
      <TokenTabContent onFinish={onSave} />
    </Drawer>
  )
}
