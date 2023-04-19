import { twJoin } from 'tailwind-merge'

export function WhyJuiceboxCard({
  className,
  iconWrapperClassName,
  icon,
  heading,
  content,
}: {
  className: string
  iconWrapperClassName: string
  icon: JSX.Element
  heading: string | JSX.Element
  content: string | JSX.Element
}) {
  return (
    <div
      className={twJoin(
        'max-w-xs flex-shrink-0 rounded-lg px-5 py-8 text-center',
        className,
      )}
    >
      <div className="flex w-full justify-center">
        <div
          className={twJoin(
            'mb-4 flex h-14 w-14 items-center justify-center rounded-full',
            iconWrapperClassName,
          )}
        >
          {icon}
        </div>
      </div>
      <h3 className="mb-2 text-2xl text-grey-900">{heading}</h3>
      <p className="mb-0 text-sm text-grey-900">{content}</p>
    </div>
  )
}
