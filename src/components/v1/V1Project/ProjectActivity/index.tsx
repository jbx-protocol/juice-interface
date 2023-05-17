import { t } from '@lingui/macro'
import SectionHeader from 'components/SectionHeader'
import { PV_V1 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectContext } from 'contexts/v1/Project/V1ProjectContext'
import { useContext, useState } from 'react'

import ActivityList from 'components/ActivityList'
import { V1DownloadActivityModal } from './V1DownloadActivityModal'

export function V1ProjectActivity() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { tokenSymbol } = useContext(V1ProjectContext)

  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()

  return (
    <>
      <ActivityList
        projectId={projectId}
        pv={PV_V1}
        header={<SectionHeader className="m-0" text={t`Activity`} />}
        tokenSymbol={tokenSymbol}
        onClickDownload={() => setDownloadModalVisible(true)}
      />
      <V1DownloadActivityModal
        open={downloadModalVisible}
        onCancel={() => setDownloadModalVisible(false)}
      />
    </>
  )
}
