import { t } from '@lingui/macro'
import ActivityList from 'components/ActivityList'
import SectionHeader from 'components/SectionHeader'
import { PV_V2 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext, useState } from 'react'

import V2V3DownloadActivityModal from '../modals/V2V3DownloadActivityModal'

export function V2V3ProjectActivity() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { tokenSymbol } = useContext(V2V3ProjectContext)

  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()

  return (
    <ActivityList
      projectId={projectId}
      pv={PV_V2}
      header={<SectionHeader className="m-0" text={t`Activity`} />}
      tokenSymbol={tokenSymbol}
      setDownloadModalVisible={setDownloadModalVisible}
      downloadComponent={
        <V2V3DownloadActivityModal
          open={downloadModalVisible}
          onCancel={() => setDownloadModalVisible(false)}
        />
      }
    />
  )
}
