import { CaretRightFilled } from '@ant-design/icons'
import { ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { classNames } from 'utils/classNames'

type RichButtonProps = {
  className?: string
  heading: JSX.Element | string
  description: JSX.Element | string
  disabled?: boolean
  prefix?: JSX.Element | string
  icon?: JSX.Element
  primaryColorClassName?: string
} & ComponentPropsWithoutRef<'div'>

export default function RichButton({
  className,
  heading,
  prefix,
  description,
  disabled,
  icon,
  primaryColorClassName,
  ...props
}: RichButtonProps) {
  return (
    <div
      className={twMerge(
        'flex cursor-pointer justify-between rounded-lg border border-smoke-300 bg-smoke-25 py-4 pl-4 transition-colors hover:border-bluebs-500 hover:bg-bluebs-25 dark:border-slate-300 dark:bg-slate-700 dark:hover:border-bluebs-500 dark:hover:bg-bluebs-950',
        className,
      )}
      {...props}
      role="button"
      onClick={e => {
        if (disabled) return

        props?.onClick?.(e)
      }}
    >
      <div className="flex">
        {prefix ? (
          <span className="text-md mr-4 mb-2 block font-medium">{prefix}</span>
        ) : null}

        <div>
          <span
            className={classNames(
              disabled
                ? 'text-grey-400 dark:text-slate-200'
                : 'text-black dark:text-slate-100',
              'text-md mb-2 block font-medium',
            )}
          >
            {heading}
          </span>
          <p
            className={classNames(
              'm-0 text-xs',
              disabled
                ? 'text-grey-400 dark:text-slate-200'
                : primaryColorClassName ?? 'text-black dark:text-slate-100',
            )}
          >
            {description}
          </p>
        </div>
      </div>

      <div
        className={classNames(
          'mr-2 flex items-center justify-center p-1 text-base',
          disabled
            ? 'text-grey-400 dark:text-slate-200'
            : 'text-grey-600 dark:text-slate-100',
        )}
      >
        {icon ?? <CaretRightFilled />}
      </div>
    </div>
  )
}
