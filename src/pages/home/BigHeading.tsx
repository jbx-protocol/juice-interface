import { twMerge } from 'tailwind-merge'

export function BigHeading({
  className,
  text,
}: {
  className?: string
  text: string | JSX.Element
}) {
  return (
    <h1 className={twMerge('m-0 text-4xl font-semibold', className)}>{text}</h1>
  )
}
