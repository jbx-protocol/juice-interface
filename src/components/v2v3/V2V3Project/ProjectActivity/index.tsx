import { DownloadOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button, Select, Space } from 'antd'
import { ActivityList } from 'components/ActivityList/ActivityList'
import SectionHeader from 'components/SectionHeader'
import { PV_V2 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { ProjectEventFilter } from 'hooks/ProjectEvents/types/eventFilters'
import { useContext, useState } from 'react'

import V2V3DownloadActivityModal from '../modals/V2V3DownloadActivityModal'

const PAGE_SIZE = 10

export default function ProjectActivity() {
  const { projectId } = useContext(ProjectMetadataContext)

  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()
  const [eventFilter, setEventFilter] = useState<ProjectEventFilter>('all')

  return (
    <div>
      <div className="mb-5 flex items-start justify-between">
        <SectionHeader className="m-0" text={t`Activity`} />

        <Space direction="horizontal" align="center" size="small">
          <Button
            type="text"
            icon={<DownloadOutlined />}
            onClick={() => setDownloadModalVisible(true)}
          />

          <Select
            className="w-[200px]"
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
            <Select.Option value="distributePayouts">
              <Trans>Sent payouts</Trans>
            </Select.Option>
            <Select.Option value="distributeTokens">
              <Trans>Sent reserved tokens</Trans>
            </Select.Option>
            <Select.Option value="configure">
              <Trans>Edited cycle</Trans>
            </Select.Option>
            <Select.Option value="setFundAccessConstraints">
              <Trans>Edited payout</Trans>
            </Select.Option>
            <Select.Option value="addToBalance">
              <Trans>Transferred ETH to project</Trans>
            </Select.Option>
            <Select.Option value="deployERC20">
              <Trans>Deployed ERC20</Trans>
            </Select.Option>
            <Select.Option value="deployETHERC20ProjectPayer">
              <Trans>Created a project payer address</Trans>
            </Select.Option>
            <Select.Option value="projectCreate">
              <Trans>Created project</Trans>
            </Select.Option>
          </Select>
        </Space>
      </div>

      <ActivityList pageSize={PAGE_SIZE} pv={[PV_V2]} projectId={projectId} />

      <V2V3DownloadActivityModal
        open={downloadModalVisible}
        onCancel={() => setDownloadModalVisible(false)}
      />
    </div>
  )
}
