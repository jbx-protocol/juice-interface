import { ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { Trans, t } from '@lingui/macro'
import { Button, Divider } from 'antd'
import Loading from 'components/Loading'
import { JuiceListbox } from 'components/inputs/JuiceListbox'
import { PV_V1, PV_V2 } from 'constants/pv'
import {
  ProjectEventFilter,
  ProjectEventsQueryArgs,
  useProjectEvents,
} from 'hooks/useProjectEvents'
import { useMemo, useState } from 'react'
import { AnyProjectEvent } from './activityEventElems/AnyProjectEvent'

interface ActivityOption {
  label: string
  value: ProjectEventFilter
}

const ALL_OPT: ActivityOption = { label: t`All activity`, value: 'all' }

const PV1_OPTS: ActivityOption[] = [
  ALL_OPT,
  { label: t`Paid`, value: 'payEvent' },
  { label: t`Redeemed`, value: 'redeemEvent' },
  { label: t`Burned`, value: 'burnEvent' },
  { label: t`Sent payouts`, value: 'tapEvent' },
  { label: t`Sent reserved tokens`, value: 'printReservesEvent' },
  { label: t`Edited cycle`, value: 'v1ConfigureEvent' },
  { label: t`Deployed ERC20`, value: 'deployedERC20Event' },
  { label: t`Transferred ETH to project`, value: 'addToBalanceEvent' },
  { label: t`Created project`, value: 'projectCreateEvent' },
]

const PV2_OPTS: ActivityOption[] = [
  ALL_OPT,
  { label: t`Paid`, value: 'payEvent' },
  { label: t`Redeemed`, value: 'redeemEvent' },
  { label: t`Burned`, value: 'burnEvent' },
  { label: t`Sent payouts`, value: 'distributePayoutsEvent' },
  {
    label: t`Sent reserved tokens`,
    value: 'distributeReservedTokensEvent',
  },
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

const SHARED_OPTS: ActivityOption[] = [
  ALL_OPT,
  { label: t`Paid`, value: 'payEvent' },
  { label: t`Redeemed`, value: 'redeemEvent' },
  { label: t`Burned`, value: 'burnEvent' },
  { label: t`Sent payouts`, value: 'distributePayoutsEvent' },
  { label: t`Sent payouts (v1)`, value: 'tapEvent' },
  {
    label: t`Sent reserved tokens`,
    value: 'distributeReservedTokensEvent',
  },
  {
    label: t`Sent reserved tokens (v1)`,
    value: 'printReservesEvent',
  },
  { label: t`Edited cycle`, value: 'configureEvent' },
  { label: t`Edited cycle (v1)`, value: 'v1ConfigureEvent' },
  { label: t`Edited payout`, value: 'setFundAccessConstraintsEvent' },
  { label: t`Transferred ETH to project`, value: 'addToBalanceEvent' },
  { label: t`Deployed ERC20`, value: 'deployedERC20Event' },
  {
    label: t`Created a project payer address`,
    value: 'deployETHERC20ProjectPayerEvent',
  },
  { label: t`Created project`, value: 'projectCreateEvent' },
]

export default function ActivityList({
  projectId,
  pv,
  from,
  pageSize,
  tokenSymbol,
  header,
  setDownloadModalVisible,
  downloadComponent,
}: Pick<ProjectEventsQueryArgs, 'projectId' | 'pv' | 'from'> & {
  pageSize?: number
  tokenSymbol?: string
  header?: JSX.Element | null
  setDownloadModalVisible?: (visible: boolean) => void
  downloadComponent?: JSX.Element | null
}) {
  const [eventFilter, setEventFilter] = useState<ProjectEventFilter>('all')

  const activityOptions = useMemo((): ActivityOption[] => {
    switch (pv) {
      case PV_V1:
        return PV1_OPTS
      case PV_V2:
        return PV2_OPTS
      default:
        return SHARED_OPTS
    }
  }, [pv])

  const [isFetchingMore, setIsFetchingMore] = useState<boolean>()

  const _pageSize = pageSize ?? 10

  const { data, fetchMore, loading } = useProjectEvents({
    filter: eventFilter,
    projectId,
    pv,
    from,
    first: _pageSize,
  })

  const isLoading = loading || isFetchingMore

  const projectEvents = data?.projectEvents

  const activityOption = activityOptions.find(o => o.value === eventFilter)

  const count = projectEvents?.length || 0

  const list = useMemo(
    () =>
      projectEvents?.map(e => (
        <div
          className="mb-5 border-b border-smoke-200 pb-5 dark:border-grey-600"
          key={e.id}
        >
          <AnyProjectEvent
            event={e}
            tokenSymbol={tokenSymbol}
            withProjectLink={!projectId}
          />
        </div>
      )),
    [projectEvents, tokenSymbol, projectId],
  )

  const listStatus = useMemo(() => {
    if (isLoading) {
      return (
        <div>
          <Loading />
        </div>
      )
    }

    if (count === 0 && !isLoading) {
      return (
        <>
          <Divider />
          <div className="my-5 pb-5 text-grey-500 dark:text-grey-300">
            <Trans>No activity yet</Trans>
          </div>
        </>
      )
    }

    if (count % _pageSize === 0) {
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
  }, [isLoading, fetchMore, count, _pageSize])

  return (
    <div>
      <div className="mb-5 flex items-baseline justify-between">
        {header}

        <div className="flex gap-2">
          {count > 0 && downloadComponent && setDownloadModalVisible && (
            <Button
              type="text"
              icon={<ArrowDownTrayIcon className="inline h-5 w-5" />}
              onClick={() => setDownloadModalVisible(true)}
            />
          )}

          <JuiceListbox
            className="w-[200px]"
            options={activityOptions}
            value={activityOption}
            onChange={v => setEventFilter(v.value)}
          />
        </div>
      </div>

      {list}

      {listStatus}

      {downloadComponent}
    </div>
  )
}
