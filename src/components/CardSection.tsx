import { ReactNode } from 'react'

export function CardSection({ children }: { children?: ReactNode }) {
  return (
    <div className="mb-[10px] mr-[10px]">
      <div className="overflow-hidden rounded-lg bg-smoke-75 py-4 px-5 dark:bg-slate-400">
        {children}
      </div>
    </div>
  )
}
