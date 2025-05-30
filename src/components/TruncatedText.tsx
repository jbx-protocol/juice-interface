import { ReactNode } from 'react'
import { twMerge } from 'tailwind-merge'

interface TruncatedTextProps {
  text: ReactNode
  className?: string
  lines?: number
}

export const TruncatedText: React.FC<
  React.PropsWithChildren<TruncatedTextProps>
> = ({ text, className, lines = 1 }) => {
  const lineClampClass = lines === 1 ? 'truncate' : `line-clamp-${lines}`
  
  return (
    <div
      className={twMerge(lineClampClass, className)}
      title={typeof text === 'string' ? text : undefined}
    >
      {text}
    </div>
  )
}
