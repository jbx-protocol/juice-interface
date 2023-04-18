import { CheckIcon } from '@heroicons/react/24/solid'

export function TickIconListItem({ text }: { text: string | JSX.Element }) {
  return (
    <li className="flex items-center gap-x-2 py-2 text-lg">
      <span className="rounded-full bg-bluebs-100 p-1 dark:bg-bluebs-900">
        <CheckIcon className="h-5 w-5 text-bluebs-500" />
      </span>
      <div>{text}</div>
    </li>
  )
}
