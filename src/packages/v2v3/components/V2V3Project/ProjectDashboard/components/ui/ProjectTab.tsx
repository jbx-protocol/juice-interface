import { Tab } from '@headlessui/react'
import { ReactNode, useEffect, useRef } from 'react'
import { twMerge } from 'tailwind-merge'

interface ProjectTabProps {
  className?: string
  name: ReactNode
  onClick: () => void
}

export const ProjectTab: React.FC<ProjectTabProps> = ({
  className,
  name,
  onClick,
}) => {
  const tabRef = useRef<HTMLButtonElement | null>(null)

  return (
    <Tab
      as="button"
      ref={tabRef}
      className={twMerge(
        'snap-start scroll-mx-4 outline-none first:ml-4 last:mr-4 md:ml-0 md:mr-0 md:first:ml-1 md:last:mr-0',
        className,
      )}
      onClick={onClick}
    >
      {({ selected }) => {
        useEffect(() => {
          if (selected && tabRef.current) {
            tabRef.current.scrollIntoView({
              behavior: 'smooth',
              block: 'nearest',
              inline: 'start',
            })
          }
        }, [selected])

        return (
          <div
            className={twMerge(
              'whitespace-nowrap px-1 pb-5 text-base dark:text-slate-200',
              selected &&
                'border-b-2 border-black font-medium dark:border-slate-50 dark:text-slate-50',
            )}
          >
            {name}
          </div>
        )
      }}
    </Tab>
  )
}
