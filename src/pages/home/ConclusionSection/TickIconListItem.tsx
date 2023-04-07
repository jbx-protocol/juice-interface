import Image from 'next/image'
import tickIcon from '/public/assets/tick-icon.png'

const tickIconWithBackground = (
  <div className="mr-3 flex h-7 w-7 items-center justify-center rounded-full bg-bluebs-100 dark:bg-bluebs-900">
    <Image src={tickIcon} alt="Tick icon" />
  </div>
)

export function TickIconListItem({ text }: { text: string | JSX.Element }) {
  return (
    <li className="flex items-center py-2 text-lg">
      {tickIconWithBackground}
      <div>{text}</div>
    </li>
  )
}
