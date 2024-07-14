import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface TruncatedTextProps {
  text: ReactNode
  className?: string
}

export const TruncatedText: React.FC<
  React.PropsWithChildren<TruncatedTextProps>
> = ({ text, className }) => {
  return (
    <div
      className={twMerge('truncate', className)}
      title={typeof text === 'string' ? text : undefined}
    >
      {text}
    </div>
  )
}
