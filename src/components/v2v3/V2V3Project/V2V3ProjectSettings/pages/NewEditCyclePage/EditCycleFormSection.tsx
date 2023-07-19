import { EditCycleHeader } from './EditCycleHeader'

export function EditCycleFormSection({
  title,
  description,
  children,
  className,
}: {
  title: JSX.Element
  description: JSX.Element
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={`grid gap-4 border-b border-b-grey-300 pt-6 pb-16 dark:border-b-grey-600 md:grid-cols-[300px_1fr] ${className}`}
    >
      <EditCycleHeader title={title} description={description} />
      <div className="flex flex-col gap-8">{children}</div>
    </section>
  )
}
