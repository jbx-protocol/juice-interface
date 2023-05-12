import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { t, Trans } from '@lingui/macro'
import { Button, Divider } from 'antd'
import { AnyProjectEvent } from 'components/activityEventElems'
import { JuiceListbox } from 'components/inputs/JuiceListbox'
import Loading from 'components/Loading'
import SectionHeader from 'components/SectionHeader'
import { PV_V2 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { ProjectEventFilter, useProjectEvents } from 'hooks/useProjectEvents'
import { useContext, useMemo, useState } from 'react'

import V2V3DownloadActivityModal from '../modals/V2V3DownloadActivityModal'

const PAGE_SIZE = 10

export function V2V3ProjectActivity() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { tokenSymbol } = useContext(V2V3ProjectContext)
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>()

  const [downloadModalVisible, setDownloadModalVisible] = useState<boolean>()
  const [eventFilter, setEventFilter] = useState<ProjectEventFilter>('all')

  const { data, fetchMore, loading } = useProjectEvents({
    pv: PV_V2,
    projectId,
    filter: eventFilter,
    first: PAGE_SIZE,
    skip: 0,
  })

  const isLoading = loading || isFetchingMore

  const projectEvents = data?.projectEvents

  const activityOption = activityOptions().find(o => o.value === eventFilter)

  const count = projectEvents?.length || 0

  const list = useMemo(
    () =>
      projectEvents?.map(e => (
        <div
          className="mb-5 border-b border-smoke-200 pb-5 dark:border-grey-600"
          key={e.id}
        >
          <AnyProjectEvent event={e} tokenSymbol={tokenSymbol} />
        </div>
      )),
    [projectEvents, tokenSymbol],
  )

  const listStatus = useMemo(() => {
    if (isLoading) {
      return (
        <div>
          <Loading />
        </div>
      )
    }

    if (count === 0 && !loading) {
      return (
        <>
          <Divider />
          <div className="my-5 pb-5 text-grey-500 dark:text-grey-300">
            <Trans>No activity yet</Trans>
          </div>
        </>
      )
    }

    if (count % PAGE_SIZE === 0) {
      return (
        <div className="text-center">
          <Button
            onClick={() => {
              setIsFetchingMore(true)
              fetchMore({
                variables: {
                  skip: count,
                },
              }).finally(() => setIsFetchingMore(false))
            }}
            type="link"
            className="px-0"
          >
            <Trans>Load more</Trans>
          </Button>
        </div>
      )
    }

    return (
      <div className="p-2 text-center text-grey-500 dark:text-grey-300">
        <Trans>{count} total</Trans>
      </div>
    )
  }, [isLoading, fetchMore, count])

  return (
    <div>
      <div className="mb-5 flex items-start justify-between">
        <SectionHeader className="m-0" text={t`Activity`} />

        <div className="flex gap-2">
          {count > 0 && (
            <Button
              type="text"
              icon={<ArrowDownTrayIcon className="inline h-5 w-5" />}
              onClick={() => setDownloadModalVisible(true)}
            />
          )}

          <JuiceListbox
            className="w-[200px]"
            options={activityOptions()}
            value={activityOption}
            onChange={v => setEventFilter(v.value)}
          />
        </div>
      </div>

      {list}

      {listStatus}

      <V2V3DownloadActivityModal
        open={downloadModalVisible}
        onCancel={() => setDownloadModalVisible(false)}
      />
    </div>
  )
}

interface ActivityOption {
  label: string
  value: ProjectEventFilter
}

const activityOptions = (): ActivityOption[] => [
  { label: t`All events`, value: 'all' },
  { label: t`Paid`, value: 'payEvent' },
  { label: t`Redeemed`, value: 'redeemEvent' },
  { label: t`Burned`, value: 'burnEvent' },
  { label: t`Sent payouts`, value: 'distributePayoutsEvent' },
  { label: t`Sent reserved tokens`, value: 'distributeReservedTokensEvent' },
  { label: t`Edited cycle`, value: 'configureEvent' },
  { label: t`Edited payout`, value: 'setFundAccessConstraintsEvent' },
  { label: t`Transferred ETH to project`, value: 'addToBalanceEvent' },
  { label: t`Deployed ERC20`, value: 'deployedERC20Event' },
  {
    label: t`Created a project payer address`,
    value: 'deployETHERC20ProjectPayerEvent',
  },
  { label: t`Created project`, value: 'projectCreateEvent' },
]
