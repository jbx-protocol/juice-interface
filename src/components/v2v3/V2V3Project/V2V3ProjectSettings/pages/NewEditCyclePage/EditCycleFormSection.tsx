import React, { forwardRef, ReactNode } from 'react'
import { EditCycleHeader } from './EditCycleHeader'

interface EditCycleFormSectionProps {
  title: JSX.Element
  description: JSX.Element
  children: ReactNode
  className?: string
}

function EditCycleFormSection(
  { title, description, children, className }: EditCycleFormSectionProps,
  ref: React.Ref<HTMLDivElement>,
) {
  return (
    <section
      ref={ref}
      className={`grid gap-8 border-b border-b-grey-300 pt-6 pb-16 dark:border-b-slate-600 md:grid-cols-[280px_1fr] ${className}`}
    >
      <EditCycleHeader title={title} description={description} />
      <div className="flex flex-col gap-8">{children}</div>
    </section>
  )
}

export default forwardRef<HTMLDivElement, EditCycleFormSectionProps>(
  EditCycleFormSection,
)
