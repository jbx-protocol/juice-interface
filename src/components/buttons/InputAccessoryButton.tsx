import { CaretDownOutlined } from '@ant-design/icons'
import { twMerge } from 'tailwind-merge'
import { classNames } from 'utils/classNames'

export default function InputAccessoryButton({
  content,
  onClick,
  withArrow,
  placement,
  disabled,
  size = 'small',
  className,
}: {
  content: string | JSX.Element | undefined
  withArrow?: boolean
  onClick?: VoidFunction
  placement?: 'prefix' | 'suffix'
  disabled?: boolean
  size?: 'small' | 'large'
  className?: string
}) {
  return content ? (
    <div
      role="button"
      className={twMerge(
        classNames(
          'select-none whitespace-nowrap rounded-lg font-medium',
          onClick && !disabled
            ? 'cursor-pointer bg-bluebs-50 text-bluebs-500 hover:text-bluebs-600 dark:bg-bluebs-700 dark:text-bluebs-200 dark:hover:text-bluebs-200'
            : 'cursor-default',
          placement === 'suffix' ? 'ml-2' : undefined,
          placement === 'prefix' ? 'mr-2' : undefined,
          size === 'small' ? 'px-1.5 py-[1px]' : 'mr-1 py-2 pl-2 pr-3',
          className,
        ),
      )}
      onClick={onClick}
    >
      {withArrow && <CaretDownOutlined className="mr-1" />}
      {content}
    </div>
  ) : null
}
