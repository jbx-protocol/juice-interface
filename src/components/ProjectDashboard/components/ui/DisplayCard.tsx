import { twMerge } from 'tailwind-merge'

type Props = {
  className?: string
  children?: React.ReactNode
}
export const DisplayCard: React.FC<Props> = ({ className, children }) => {
  return (
    <div className={twMerge('rounded-lg bg-smoke-50 py-5 px-6', className)}>
      {children}
    </div>
  )
}
