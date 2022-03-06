import { Trans } from '@lingui/macro'
import { Drawer } from 'antd'
import FundingTabContent from 'components/v2/V2Create/tabs/FundingTab/FundingTabContent'
import ProjectDetailsTabContent from 'components/v2/V2Create/tabs/ProjectDetailsTabContent'

import { drawerStyle } from 'constants/styles/drawerStyle'

const FundingDrawersSubtitles = (
  <p>
    Updates you make to this section will only be applied to <i>upcoming</i>{' '}
    funding cycles.
  </p>
)

export function V2ReconfigureProjectDrawer({
  visible,
  onFinish,
}: {
  visible: boolean
  onFinish?: () => void
}) {
  return (
    <Drawer visible={visible} {...drawerStyle} onClose={onFinish}>
      <h3>
        <Trans>Reconfigure project details</Trans>
      </h3>
      <p>
        Project details reconfigurations will create a separate transaction.
      </p>
      <br />
      <ProjectDetailsTabContent onFinish={onFinish} hidePreview />
    </Drawer>
  )
}

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
      <FundingTabContent onFinish={onFinish} hidePreview />
    </Drawer>
  )
}
