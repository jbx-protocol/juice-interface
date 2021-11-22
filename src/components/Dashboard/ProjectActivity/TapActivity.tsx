import { ProjectContext } from 'contexts/projectContext'
import { useContext } from 'react'

import TapEventElem from './TapEventElem'
import useSubgraphQuery from '../../../hooks/SubgraphQuery'

export function TapActivity({
  pageNumber,
  pageSize,
  setLoading,
  setCount,
}: {
  pageNumber: number
  pageSize: number
  setLoading: (loading: boolean) => void
  setCount: (count: number) => void
}) {
  const { projectId } = useContext(ProjectContext)

  const { data: tapEvents } = useSubgraphQuery(
    {
      entity: 'tapEvent',
      keys: [
        'netTransferAmount',
        'fundingCycleId',
        'timestamp',
        'txHash',
        'beneficiary',
        'caller',
        'beneficiaryTransferAmount',
      ],
      first: pageSize,
      skip: pageNumber * pageSize,
      orderDirection: 'desc',
      orderBy: 'timestamp',
      where: projectId
        ? {
            key: 'project',
            value: projectId.toString(),
          }
        : undefined,
    },
    {
      onSuccess: data => {
        setLoading(false)
        setCount(data?.length)
      },
    },
  )

  return (
    <div>
      {tapEvents?.map(e => (
        <TapEventElem key={e.id} tapEvent={e} />
      ))}
    </div>
  )
}
