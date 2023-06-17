import { Tab } from '@headlessui/react'
import { twMerge } from 'tailwind-merge'

export const ProjectTab = ({
  className,
  name,
  onClick,
}: {
  className?: string
  name: string
  onClick: VoidFunction
}) => (
  <Tab
    as="button"
    className={twMerge(
      'snap-start scroll-mx-4 outline-none first:ml-4 last:mr-4 md:ml-0 md:mr-0',
      className,
    )}
    onClick={onClick}
  >
    {({ selected }) => (
      <div
        className={twMerge(
          'whitespace-nowrap px-1 pb-5 dark:text-slate-200',
          selected &&
            'border-b-2 border-black font-semibold dark:border-slate-50 dark:text-slate-50',
        )}
      >
        {name}
      </div>
    )}
  </Tab>
)
