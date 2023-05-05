import { Button, ButtonProps } from 'antd'
import { classNames } from 'utils/classNames'

export const CreateButton: React.FC<
  React.PropsWithChildren<ButtonProps>
> = props => {
  return (
    <Button
      {...props}
      className={classNames(
        'flex items-center justify-center gap-2 border-bluebs-500 bg-bluebs-50 leading-none text-bluebs-500 dark:bg-bluebs-900 dark:text-bluebs-300',
        props.className,
      )}
      type="dashed"
    >
      {props.children}
    </Button>
  )
}
