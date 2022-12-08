import { CaretDownOutlined } from '@ant-design/icons'
import { classNames } from 'utils/classNames'

export default function InputAccessoryButton({
  content,
  onClick,
  withArrow,
  placement,
  disabled,
}: {
  content: string | JSX.Element | undefined
  withArrow?: boolean
  onClick?: VoidFunction
  placement?: 'prefix' | 'suffix'
  disabled?: boolean
}) {
  return content ? (
    <div
      role="button"
      className={classNames(
        'select-none whitespace-nowrap px-1.5 py-[1px] font-medium',
        onClick && !disabled
          ? 'cursor-pointer bg-haze-200 text-haze-500 hover:text-haze-600 dark:bg-haze-300 dark:text-haze-900 dark:hover:text-haze-800'
          : 'cursor-default',
        placement === 'suffix' ? 'ml-2' : undefined,
        placement === 'prefix' ? 'mr-2' : undefined,
      )}
      onClick={onClick}
    >
      {content}
      {withArrow && <CaretDownOutlined className="ml-1" />}
    </div>
  ) : null
}
