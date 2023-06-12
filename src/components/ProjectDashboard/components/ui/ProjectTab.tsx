import { Tab } from '@headlessui/react'
import { twMerge } from 'tailwind-merge'

export const ProjectTab = ({
  name,
  onClick,
}: {
  name: string
  onClick: VoidFunction
}) => (
  <Tab as="button" className="outline-none" onClick={onClick}>
    {({ selected }) => (
      <div
        className={twMerge(
          'px-1 pb-5 dark:text-slate-200',
          selected &&
            'border-b-2 border-black font-semibold dark:border-slate-50 dark:text-slate-50',
        )}
      >
        {name}
      </div>
    )}
  </Tab>
)
