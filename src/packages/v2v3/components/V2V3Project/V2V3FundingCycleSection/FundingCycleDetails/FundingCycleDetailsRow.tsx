import { Divider } from 'antd'

// e.g. 'Funding cycle', 'Token', 'Rules' sections
export function FundingCycleDetailsRow({
  header,
  items,
}: {
  header: string
  items: JSX.Element
}) {
  return (
    <div>
      <div className="flex items-center">
        <h5 className="mr-2 whitespace-nowrap text-sm font-medium uppercase text-grey-500 dark:text-grey-300">
          {header}
        </h5>
        <Divider className="mt-0.5 mb-2 min-w-[unset]" />
      </div>
      <div>{items}</div>
    </div>
  )
}
