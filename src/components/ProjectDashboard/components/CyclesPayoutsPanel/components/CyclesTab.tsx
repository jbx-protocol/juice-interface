import { Tab } from '@headlessui/react'
import { twMerge } from 'tailwind-merge'

export const CyclesTab = ({ name }: { name: string }) => (
  <Tab as="button" className="outline-none">
    {({ selected }) => (
      <div
        className={twMerge(
          'rounded-2xl bg-smoke-50 py-0.5 px-3 text-smoke-600',
          selected && 'bg-smoke-700 text-grey-25',
        )}
      >
        {name}
      </div>
    )}
  </Tab>
)
