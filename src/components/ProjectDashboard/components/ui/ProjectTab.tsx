import { Tab } from '@headlessui/react'
import { twMerge } from 'tailwind-merge'

export const ProjectTab = ({ name }: { name: string }) => (
  <Tab as="button" className="outline-none">
    {({ selected }) => (
      <div
        className={twMerge('px-1 pb-5', selected && 'border-b-2 border-black')}
      >
        {name}
      </div>
    )}
  </Tab>
)
