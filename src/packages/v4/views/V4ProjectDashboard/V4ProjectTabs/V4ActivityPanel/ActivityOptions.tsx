import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import { Button } from 'antd'
import { ActivityOption, ALL_OPT } from 'components/ActivityList'
import { JuiceListbox } from 'components/inputs/JuiceListbox'
import { ProjectEventFilter } from 'models/projectEvents'
import { useState } from 'react'
import DownloadActivityModal from './DownloadActivityModal'
import { ActivityEvents } from './models/ActivityEvents'

const activityOptions = (): ActivityOption[] => [
  ALL_OPT(),
  { label: t`Paid`, value: 'payEvent' },
  // TODO:: Other events:
  // { label: t`Redeemed`, value: 'redeemEvent' },
  // { label: t`Burned`, value: 'burnEvent' },
  // { label: t`Sent payouts`, value: 'distributePayoutsEvent' },
  // {
  //   label: t`Sent reserved tokens`,
  //   value: 'distributeReservedTokensEvent',
  // },
  // { label: t`Edited cycle`, value: 'configureEvent' },
  // { label: t`Edited payout`, value: 'setFundAccessConstraintsEvent' },
  // { label: t`Transferred ETH to project`, value: 'addToBalanceEvent' },
  // { label: t`Deployed ERC20`, value: 'deployedERC20Event' },
  // {
  //   label: t`Created a project payer address`,
  //   value: 'deployETHERC20ProjectPayerEvent',
  // },
  // { label: t`Created project`, value: 'projectCreateEvent' },
]

export function ActivityOptions({ events }: { events: ActivityEvents }) {
  const [eventFilter, setEventFilter] = useState<ProjectEventFilter>('all')

  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()

  const activityOption = activityOptions().find(o => o.value === eventFilter)

  const hasAnyEvents = Object.values(events).some(
    eventArray => eventArray && eventArray.length > 0,
  )
  const canDownload = hasAnyEvents

  return (
    <>
      <div className="flex gap-2">
        {canDownload && (
          <Button
            type="text"
            icon={<ArrowDownTrayIcon className="inline h-5 w-5" />}
            onClick={() => setDownloadModalVisible(true)}
          />
        )}

        <JuiceListbox
          className={canDownload ? 'w-[200px]' : 'w-[240px]'}
          options={activityOptions()}
          value={activityOption}
          onChange={v => setEventFilter(v.value)}
        />
      </div>
      <DownloadActivityModal
        open={downloadModalVisible}
        onCancel={() => setDownloadModalVisible(false)}
      />
    </>
  )
}
