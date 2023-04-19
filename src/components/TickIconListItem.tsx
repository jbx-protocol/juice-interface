import { CheckIcon } from './icons/Check'

export function TickIconListItem({ text }: { text: string | JSX.Element }) {
  return (
    <li className="flex items-center gap-x-3 py-2 text-lg">
      <span className="rounded-full bg-bluebs-100 p-2 dark:bg-bluebs-900">
        <CheckIcon className="h-4 w-4 text-bluebs-500" />
      </span>
      <div>{text}</div>
    </li>
  )
}
