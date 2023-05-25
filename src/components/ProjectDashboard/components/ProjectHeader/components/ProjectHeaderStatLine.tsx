import { ReactNode } from 'react'

export const HeaderStat = ({
  title,
  stat,
}: {
  title: ReactNode
  stat: ReactNode
}) => {
  return (
    <div className="flex flex-col justify-end gap-1">
      <span className="text-sm uppercase text-grey-500">{title}</span>
      <span className="text-4xl">{stat}</span>
    </div>
  )
}
