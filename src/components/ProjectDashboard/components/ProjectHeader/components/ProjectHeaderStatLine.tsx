import { ReactNode } from 'react'

export const HeaderStat = ({
  title,
  stat,
}: {
  title: ReactNode
  stat: ReactNode
}) => {
  return (
    <div className="flex flex-col gap-1  text-end">
      <span className="text-sm uppercase text-grey-500">{title}</span>
      <span className="text-medium font-heading text-4xl">{stat}</span>
    </div>
  )
}
