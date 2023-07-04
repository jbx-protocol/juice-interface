import { ReactNode } from 'react'
import { LinkItem, LinkListing } from './LinkListing'

export type LinkColProps = {
  title: ReactNode
  items: LinkItem[]
  title2?: ReactNode
  items2?: LinkItem[]
}

export const LinkColumn: React.FC<React.PropsWithChildren<LinkColProps>> = ({
  title,
  items,
  title2,
  items2,
}) => {
  const titleClass = 'font-medium text-slate-200'
  return (
    <div className="flex flex-col gap-y-3">
      <div className={titleClass}>{title}</div>
      <LinkListing items={items} />
      {title2 && items2 && (
        <>
          <div className={titleClass}>{title2}</div>
          <LinkListing items={items2} />
        </>
      )}
    </div>
  )
}
