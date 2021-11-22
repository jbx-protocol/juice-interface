import { ProjectContext } from 'contexts/projectContext'
import { useContext } from 'react'

import ReservesEventElem from './ReservesEventElem'
import useSubgraphQuery from '../../../hooks/SubgraphQuery'

export function ReservesActivity({
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

  const { data: printReservesEvents } = useSubgraphQuery(
    {
      entity: 'printReservesEvent',
      keys: [
        'id',
        'count',
        'beneficiary',
        'beneficiaryTicketAmount',
        'timestamp',
        'txHash',
        'caller',
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
      {printReservesEvents?.map(e => (
        <ReservesEventElem key={e.id} printReservesEvent={e} />
      ))}
    </div>
  )
}
