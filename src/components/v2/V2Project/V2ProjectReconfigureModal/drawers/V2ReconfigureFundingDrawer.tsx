import { Trans } from '@lingui/macro'
import { Drawer } from 'antd'
import StandardSaveButton from 'components/StandardSaveButton'
import FundingTabContent from 'components/v2/V2Create/tabs/FundingTab/FundingTabContent'

import { drawerStyle } from 'constants/styles/drawerStyle'
import { FundingDrawersSubtitles } from '..'

export function V2ReconfigureFundingDrawer({
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
        <Trans>Reconfigure funding target/duration</Trans>
      </h3>
      {FundingDrawersSubtitles}
      <br />
      <FundingTabContent
        onFinish={onSave}
        hidePreview
        saveButton={<StandardSaveButton />}
      />
    </Drawer>
  )
}
