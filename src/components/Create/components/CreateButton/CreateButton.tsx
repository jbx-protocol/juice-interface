import { Button, ButtonProps } from 'antd'
import { classNames } from 'utils/classNames'

export const CreateButton: React.FC<ButtonProps> = props => {
  return (
    <Button
      {...props}
      className={classNames(
        'border-haze-400 bg-haze-50 text-haze-400 dark:bg-haze-900 dark:text-haze-300',
        props.className,
      )}
      type="dashed"
    >
      {props.children}
    </Button>
  )
}
