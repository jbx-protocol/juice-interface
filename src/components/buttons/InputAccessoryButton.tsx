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
}: {
  content: string | JSX.Element | undefined
  withArrow?: boolean
  onClick?: VoidFunction
  placement?: 'prefix' | 'suffix'
  disabled?: boolean
  size?: 'small' | 'large'
}) {
  return content ? (
    <div
      role="button"
      className={twMerge(
        classNames(
          'select-none whitespace-nowrap px-1.5 py-[1px] font-medium',
          onClick && !disabled
            ? 'cursor-pointer bg-haze-200 text-haze-500 hover:text-haze-600 dark:bg-haze-700 dark:text-haze-200 dark:hover:text-haze-200'
            : 'cursor-default',
          placement === 'suffix' ? 'ml-2' : undefined,
          placement === 'prefix' ? 'mr-2' : undefined,
          size === 'small' ? 'px-1.5 py-[1px]' : 'mr-1 px-2 py-1',
        ),
      )}
      onClick={onClick}
    >
      {content}
      {withArrow && <CaretDownOutlined className="ml-1" />}
    </div>
  ) : null
}
