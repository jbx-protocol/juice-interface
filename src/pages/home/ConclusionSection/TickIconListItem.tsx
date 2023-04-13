import { TickIconSolid } from 'components/icons/TickIconSolid'

export function TickIconListItem({ text }: { text: string | JSX.Element }) {
  return (
    <li className="flex items-center py-2 text-lg">
      <TickIconSolid />
      <div>{text}</div>
    </li>
  )
}
