import { classNames } from 'utils/classNames'

export function BigHeading({
  className,
  text,
}: {
  className?: string
  text: string | JSX.Element
}) {
  return <h1 className={classNames('m-0 font-semibold', className)}>{text}</h1>
}
