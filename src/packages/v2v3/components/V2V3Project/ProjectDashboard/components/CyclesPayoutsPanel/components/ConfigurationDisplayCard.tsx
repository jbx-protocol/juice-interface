import { Disclosure, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Trans } from '@lingui/macro'
import { Fragment } from 'react'
import { twMerge } from 'tailwind-merge'
import { useConfigurationDisplayCard } from '../hooks/useConfigurationDisplayCard'
import { CurrentUpcomingConfigurationPanel } from './CurrentUpcomingConfigurationPanel'

export const ConfigurationDisplayCard = ({
  type,
}: {
  type: 'current' | 'upcoming'
}) => {
  const { title } = useConfigurationDisplayCard(type)

  return (
    <Disclosure
      as="div"
      className={twMerge('rounded-lg bg-smoke-50 py-5 px-6 dark:bg-slate-700')}
    >
      {({ open }) => (
        <div className="w-full outline-none">
          <Disclosure.Button className="flex w-full items-center justify-between text-start">
            <div className="flex flex-col gap-2 text-sm font-medium text-grey-600 dark:text-slate-200">
              {title}
              <div className="font-heading text-xl font-medium text-grey-900 dark:text-slate-50">
                <Trans>Rules</Trans>
              </div>
            </div>
            <ChevronDownIcon
              className={twMerge('h-6 w-6', open && 'rotate-180')}
            />
          </Disclosure.Button>

          <Transition
            show={open}
            as={Fragment}
            enter="transition-all ease-in-out duration-300"
            enterFrom="max-h-0 overflow-hidden opacity-0"
            // Max height is set to a large value to allow the transition to work.
            enterTo="max-h-[3000px] overflow-hidden opacity-100"
            leave="transition-all ease-in-out duration-300"
            leaveFrom="max-h-[3000px] overflow-hidden opacity-100"
            leaveTo="max-h-0 overflow-hidden opacity-0"
          >
            <Disclosure.Panel className="mt-8">
              <CurrentUpcomingConfigurationPanel type={type} />
            </Disclosure.Panel>
          </Transition>
        </div>
      )}
    </Disclosure>
  )
}
