import { Disclosure, Transition } from '@headlessui/react'
import { MinusIcon, PlusIcon } from '@heroicons/react/24/solid'
import { Trans } from '@lingui/macro'
import QAs from 'components/Home/FaqList/QAs'
import { SectionContainer } from 'components/Home/SectionContainer'
import { SectionHeading } from 'components/Home/SectionHeading'
import { Fragment, useState } from 'react'

export function FaqSection() {
  const qa = QAs()
  const [openId, setOpenId] = useState<string | null>()

  const toggleDisclosure = (id: string) => () => {
    setOpenId(openId === id ? null : id)
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
                    className="w-full py-8 outline-none"
                    onClick={toggleDisclosure(id)}
                  >
                    <>
                      <div className="text-primary flex w-full items-center justify-between gap-6 text-start text-lg font-medium">
                        {q}
                        <FaqButton open={isOpen} />
                      </div>

                      <Transition
                        show={isOpen}
                        as={Fragment}
                        enter="transition-all ease-in-out duration-300"
                        enterFrom="max-h-0 overflow-hidden opacity-0"
                        enterTo="max-h-[1000px] overflow-hidden opacity-100"
                        leave="transition-all ease-in-out duration-300"
                        leaveFrom="max-h-[1000px] overflow-hidden opacity-100"
                        leaveTo="max-h-0 overflow-hidden opacity-0"
                      >
                        <Disclosure.Panel className="mt-4 cursor-default pr-12 text-start text-grey-600 dark:text-slate-200">
                          {a}
                        </Disclosure.Panel>
                      </Transition>
                    </>
                  </Disclosure.Button>
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
