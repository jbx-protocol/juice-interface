import { Button, ButtonProps } from 'antd'
import { classNames } from 'utils/classNames'

export const CreateButton: React.FC<ButtonProps> = props => {
  return (
    <Button
      {...props}
      className={classNames(
        'text-haze-400 dark:text-haze-300 bg-haze-50 dark:bg-haze-900 border-haze-400',
        props.className,
      )}
      type="dashed"
    >
      {props.children}
    </Button>
  )
}
