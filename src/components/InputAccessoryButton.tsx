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
        'font-medium, select-none whitespace-nowrap rounded-sm px-1.5 py-[1px]',
        onClick && !disabled
          ? 'cursor-pointer bg-haze-100 text-haze-400 dark:bg-haze-800 dark:text-haze-300'
          : 'cursor-default',
        placement === 'suffix' ? 'ml-2' : undefined,
        placement === 'prefix' ? 'mr-2' : undefined,
      )}
      onClick={onClick}
    >
      {content}
      {withArrow && <CaretDownOutlined className="ml-1 text-xs" />}
    </div>
  ) : null
}
