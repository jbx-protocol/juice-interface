import { DownloadOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Select, Space } from 'antd'
import { ActivityList } from 'components/ActivityList/ActivityList'
import SectionHeader from 'components/SectionHeader'
import { PV_V1 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1EventFilter } from 'hooks/ProjectEvents/types/eventFilters'
import { useContext, useState } from 'react'

import { V1DownloadActivityModal } from './V1DownloadActivityModal'

const PAGE_SIZE = 10

export default function ProjectActivity() {
  const { projectId } = useContext(ProjectMetadataContext)

  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()
  const [eventFilter, setEventFilter] = useState<V1EventFilter>('all')

  return (
    <div>
      <div className="mb-5 flex items-center justify-between">
        <SectionHeader className="m-0" text={t`Activity`} />
        <Space direction="horizontal" align="center" size="small">
          <Button
            type="text"
            icon={<DownloadOutlined />}
            onClick={() => setDownloadModalVisible(true)}
          />

          <Select
            className="small w-48"
            value={eventFilter}
            onChange={val => setEventFilter(val)}
          >
            <Select.Option value="all">
              <Trans>All events</Trans>
            </Select.Option>
            <Select.Option value="pay">
              <Trans>Paid</Trans>
            </Select.Option>
            <Select.Option value="redeem">
              <Trans>Redeemed</Trans>
            </Select.Option>
            <Select.Option value="burn">
              <Trans>Burned</Trans>
            </Select.Option>
            <Select.Option value="withdraw">
              <Trans>Sent payouts</Trans>
            </Select.Option>
            <Select.Option value="printReserves">
              <Trans>Sent reserved tokens</Trans>
            </Select.Option>
            <Select.Option value="configure">
              <Trans>Edited cycle</Trans>
            </Select.Option>
            <Select.Option value="deployERC20">
              <Trans>Deployed ERC20</Trans>
            </Select.Option>
            <Select.Option value="projectCreate">
              <Trans>Created project</Trans>
            </Select.Option>
            <Select.Option value="addToBalance">
              <Trans>Transferred ETH to project</Trans>
            </Select.Option>
          </Select>
        </Space>
      </div>

      <ActivityList pageSize={PAGE_SIZE} pv={[PV_V1]} projectId={projectId} />

      <V1DownloadActivityModal
        open={downloadModalVisible}
        onCancel={() => setDownloadModalVisible(false)}
      />
    </div>
  )
}
