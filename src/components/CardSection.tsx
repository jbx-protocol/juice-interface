import { PropsWithChildren } from 'react'

export function CardSection({
  header,
  children,
}: PropsWithChildren<{
  header?: string
}>) {
  return (
    <div className="mb-[10px] mr-[10px]">
      {header && <h2 className="m-0 font-medium">{header}</h2>}
      <div className="overflow-hidden rounded-lg bg-smoke-75 py-4 px-5 dark:bg-slate-400">
        {children}
      </div>
    </div>
  )
}
