import { Disclosure, Transition } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import { Fragment, useState } from 'react'
import { twMerge } from 'tailwind-merge'
import QAs from '../FaqList/QAs'
import { SectionContainer } from './SectionContainer'
import { SectionHeading } from './SectionHeading'

export function FaqSection() {
  const qa = QAs()
  const [openId, setOpenId] = useState<string | null>(qa[0].id)

  const toggleDisclosure = (id: string) => () => {
    if (openId === id) {
      setOpenId(null)
      return
    }
    if (openId !== null) {
      setOpenId(null)
      setTimeout(() => {
        setOpenId(id)
      }, 300)
      return
    }
    setOpenId(id)
  }

  return (
    <SectionContainer>
      <SectionHeading heading={<Trans>FAQs</Trans>} />
      <div className="mx-auto w-full max-w-3xl">
        {qa.map(({ id, q, a }) => (
          <Disclosure as="div" key={id}>
            {() => {
              const isOpen = openId === id
              return (
                <div className="stroke-tertiary border-t">
                  <Disclosure.Button
                    className={twMerge(
                      'text-primary flex w-full items-center justify-between gap-6 text-start text-lg font-medium outline-none',
                      isOpen ? 'pb-2 pt-8' : 'py-8',
                    )}
                    onClick={toggleDisclosure(id)}
                  >
                    {q}
                    <FaqButton open={isOpen} />
                  </Disclosure.Button>
                  <Transition
                    show={isOpen}
                    as={Fragment}
                    enter="transition-all ease-in-out duration-300"
                    enterFrom="transform opacity-0 scale-95"
                    enterTo="transform opacity-100 scale-100"
                    leave="transition-all ease-in-out duration-300"
                    leaveFrom="transform opacity-100 scale-100"
                    leaveTo="transform opacity-0 scale-95"
                  >
                    <Disclosure.Panel className="pb-8 pr-12 text-grey-600 dark:text-slate-200">
                      {a}
                    </Disclosure.Panel>
                  </Transition>
                </div>
              )
            }}
          </Disclosure>
        ))}
      </div>
    </SectionContainer>
  )
}

const FaqButton = ({ open }: { open: boolean }) => {
  return (
    <div className="relative h-6 w-6">
      <Transition
        show={!open}
        as={Fragment}
        enter="transition-opacity ease-in-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-in-out duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <PlusIcon className="absolute h-6 w-6" aria-hidden="true" />
      </Transition>
      <Transition
        show={open}
        as={Fragment}
        enter="transition-opacity ease-in-out duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity ease-in-out duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <MinusIcon className="absolute h-6 w-6" aria-hidden="true" />
      </Transition>
    </div>
  )
}
