export function EditCycleHeading({
  title,
  description,
}: {
  title: JSX.Element
  description: JSX.Element
}) {
  return (
    <div className="mb-2 text-sm font-medium">
      <div className="mb-2 font-medium">{title}</div>
      <div className="text-secondary">{description}</div>
    </div>
  )
}
