import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import { useHistorySubPanel } from '../hooks/useHistorySubPanel'

export type HistoryData = {
  cycleNumber: string
  withdrawn: string
  date: string
}[]

export const HistorySubPanel = () => {
  const { loading, data, error } = useHistorySubPanel()
  const tableHeaders = [t`Cycle #`, t`Withdrawn`, t`Date`]

  return (
    <table className="min-w-full divide-y divide-grey-200">
      <thead>
        <tr className="bg-smoke-50">
          {tableHeaders.map(header => (
            <th
              key={header}
              scope="col"
              className="py-3 pl-4 pr-3 text-start text-sm font-semibold"
            >
              {header}
            </th>
          ))}
          <th scope="col" className="relative py-3 pl-4 pr-3">
            <span className="sr-only">Edit</span>
          </th>
        </tr>
      </thead>
      <tbody className="divide-y divide-grey-200">
        {loading ? (
          <>
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
            <SkeletonRow />
          </>
        ) : error ? (
          <div className="text-error-400">{error}</div>
        ) : (
          <>
            {data.map(cycle => (
              <tr key={cycle.cycleNumber}>
                <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
                  {cycle.cycleNumber}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm font-medium">
                  {cycle.withdrawn}
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-sm text-grey-500">
                  {cycle.date}
                </td>
                <td className="text-gray-500 whitespace-nowrap px-3 py-4 text-sm">
                  <ChevronDownIcon />
                </td>
              </tr>
            ))}
          </>
        )}
      </tbody>
    </table>
  )
}

const SkeletonRow = () => (
  <tr className="animate-pulse bg-white">
    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
      <div className="h-4 w-3/4 rounded bg-grey-200"></div>
    </td>
    <td className="whitespace-nowrap px-4 py-4 text-sm font-medium">
      <div className="h-4 rounded bg-grey-200"></div>
    </td>
    <td className="whitespace-nowrap px-4 py-4 text-sm text-grey-500">
      <div className="h-4 w-5/6 rounded bg-grey-200"></div>
    </td>
  </tr>
)
