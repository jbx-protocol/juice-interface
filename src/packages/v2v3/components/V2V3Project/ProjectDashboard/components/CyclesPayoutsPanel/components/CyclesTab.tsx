import { Tab } from '@headlessui/react'
import { twMerge } from 'tailwind-merge'

export const CyclesTab = ({ name }: { name: string }) => (
  <Tab as="button" className="outline-none">
    {({ selected }) => (
      <div
        className={twMerge(
          'rounded-2xl bg-smoke-50 py-0.5 px-3 font-medium text-smoke-600 dark:bg-slate-700 dark:text-slate-200',
          selected &&
            'bg-smoke-700 text-grey-25 dark:bg-slate-400 dark:text-slate-50',
        )}
      >
        {name}
      </div>
    )}
  </Tab>
)
