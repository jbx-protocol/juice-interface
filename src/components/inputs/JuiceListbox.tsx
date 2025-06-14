import { Listbox, Transition } from '@headlessui/react'

import { ChevronDownIcon } from '@heroicons/react/24/outline'
import { Fragment } from 'react'
import { twMerge } from 'tailwind-merge'

export interface JuiceListboxOption<T> {
  label: string | JSX.Element
  value: T
}

interface JuiceListboxProps<T> {
  disabled?: boolean
  className?: string
  buttonClassName?: string
  value?: JuiceListboxOption<T>
  options: JuiceListboxOption<T>[]
  onChange?: (value: JuiceListboxOption<T>) => void
  dropdownPosition?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'
}

export function JuiceListbox<T>(props: JuiceListboxProps<T>) {
  const { value, onChange, options, buttonClassName, className, disabled, dropdownPosition = 'bottom-right' } =
    props

  const getDropdownClasses = () => {
    const baseClasses = "absolute z-10 max-h-60 overflow-auto rounded-lg border border-smoke-300 bg-white text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:border-slate-300 dark:bg-slate-800 sm:text-sm"
    
    switch (dropdownPosition) {
      case 'bottom-left':
        return `${baseClasses} mt-1 right-0`
      case 'top-right':
        return `${baseClasses} mb-1 bottom-full left-0`
      case 'top-left':
        return `${baseClasses} mb-1 bottom-full right-0`
      case 'bottom-right':
      default:
        return `${baseClasses} mt-1 left-0`
    }
  }

  return (
    <Listbox value={value} onChange={onChange} disabled={disabled}>
      <div className={twMerge('relative', className)}>
        <Listbox.Button
          className={twMerge(
            'flex h-full w-full items-center justify-between gap-1 rounded-lg border border-smoke-300 bg-smoke-50 py-2 px-3 dark:border-slate-300 dark:bg-slate-600 dark:placeholder:text-slate-300',
            disabled
              ? 'cursor-not-allowed text-grey-400 dark:text-slate-300'
              : 'cursor-pointer text-black dark:text-slate-100',
            buttonClassName,
          )}
        >
          <span className="block truncate">
            {disabled ? <span>N.A</span> : value?.label}
          </span>
          <span className="pointer-events-none flex items-center justify-end">
            <ChevronDownIcon
              className="text-gray-400 h-4 w-4"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0" 
        >
          <Listbox.Options className={getDropdownClasses()}>
            {options.map((option, optionIdx) => (
              <Listbox.Option
                key={optionIdx}
                className={({ active, selected }) =>
                  `relative cursor-pointer select-none py-2 pl-3 pr-4 ${
                    active || selected ? 'bg-smoke-300 dark:bg-slate-600' : ''
                  }`
                }
                value={option}
              >
                {({ selected }) => (
                  <>
                    <div
                      className={`${selected ? 'font-bold' : 'font-normal'}`}
                    >
                      {option.label}
                    </div>
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  )
}
