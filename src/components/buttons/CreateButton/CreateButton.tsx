import { Button, ButtonProps } from 'antd'
import { classNames } from 'utils/classNames'

export const CreateButton: React.FC<ButtonProps> = props => {
  return (
    <Button
      {...props}
      className={classNames(
        'border-bluebs-400 bg-bluebs-50 text-bluebs-400 dark:bg-bluebs-900 dark:text-bluebs-300',
        props.className,
      )}
      type="dashed"
    >
      {props.children}
    </Button>
  )
}
