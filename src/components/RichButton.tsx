import { CaretRightFilled } from '@ant-design/icons'
import { ComponentPropsWithoutRef } from 'react'
import { twMerge } from 'tailwind-merge'
import { classNames } from 'utils/classNames'

export type RichButtonProps = {
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
        'flex cursor-pointer justify-between rounded-sm border border-solid border-smoke-300 bg-smoke-25 py-4 pl-4 transition-colors hover:border-smoke-500 dark:border-slate-300 dark:bg-slate-700 dark:hover:border-slate-100',
        className,
      )}
      {...props}
      role="button"
      onClick={e => {
        if (disabled) return

        props?.onClick?.(e)
      }}
    >
      <div
        className={classNames(
          'flex',
          disabled
            ? 'text-grey-400 dark:text-slate-200'
            : 'text-haze-400 dark:text-haze-300',
        )}
      >
        {prefix ? <h4 className="mr-4">{prefix}</h4> : null}

        <div>
          <h4
            className={classNames(
              disabled
                ? 'text-grey-400 dark:text-slate-200'
                : 'text-haze-400 dark:text-haze-300',
            )}
          >
            {heading}
          </h4>
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
          'mr-2 flex items-center justify-center p-1',
          disabled
            ? 'text-grey-400 dark:text-slate-200'
            : 'text-haze-400 dark:text-haze-300',
        )}
      >
        {icon ?? <CaretRightFilled />}
      </div>
    </div>
  )
}
