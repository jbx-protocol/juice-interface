import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'

const cycles = [
  {
    cycleNumber: '#22',
    Withdrawn: '$23,000',
    date: 'a month ago',
  },
  {
    cycleNumber: '#21',
    Withdrawn: '$20,000',
    date: '2 months ago',
  },
  {
    cycleNumber: '#20',
    Withdrawn: '$18,000',
    date: '3 months ago',
  },
  {
    cycleNumber: '#19',
    Withdrawn: '$16,000',
    date: '4 months ago',
  },
  {
    cycleNumber: '#18',
    Withdrawn: '$15,000',
    date: '5 months ago',
  },
  {
    cycleNumber: '#17',
    Withdrawn: '$14,000',
    date: '6 months ago',
  },
  {
    cycleNumber: '#16',
    Withdrawn: '$12,000',
    date: '7 months ago',
  },
  {
    cycleNumber: '#15',
    Withdrawn: '$10,000',
    date: '8 months ago',
  },
  {
    cycleNumber: '#14',
    Withdrawn: '$8,000',
    date: '9 months ago',
  },
  {
    cycleNumber: '#13',
    Withdrawn: '$6,000',
    date: '10 months ago',
  },
  {
    cycleNumber: '#12',
    Withdrawn: '$4,000',
    date: '11 months ago',
  },
  {
    cycleNumber: '#11',
    Withdrawn: '$2,000',
    date: '12 months ago',
  },
]

export const HistorySubPanel = () => {
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
        {cycles.map(cycle => (
          <tr key={cycle.date}>
            <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium">
              {cycle.cycleNumber}
            </td>
            <td className="whitespace-nowrap px-4 py-4 text-sm font-medium">
              {cycle.Withdrawn}
            </td>
            <td className="whitespace-nowrap px-4 py-4 text-sm text-grey-500">
              {cycle.date}
            </td>
            <td className="text-gray-500 whitespace-nowrap px-3 py-4 text-sm">
              <ChevronDownIcon />
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}
