import { Trans } from '@lingui/macro'
import { Button, Drawer } from 'antd'
import StandardSaveButton from 'components/StandardSaveButton'
import FundingTabContent from 'components/v2/V2Create/tabs/FundingTab/FundingTabContent'

import { drawerStyle } from 'constants/styles/drawerStyle'
import { FundingDrawersSubtitles } from '..'

export function V2ReconfigureFundingDrawer({
  visible,
  onFinish,
}: {
  visible: boolean
  onFinish: VoidFunction
}) {
  return (
    <Drawer visible={visible} {...drawerStyle} onClose={onFinish}>
      <h3>
        <Trans>Reconfigure funding target/duration</Trans>
      </h3>
      {FundingDrawersSubtitles}
      <br />
      <FundingTabContent
        onFinish={onFinish}
        hidePreview
        saveButton={<StandardSaveButton />}
      />
    </Drawer>
  )
}
