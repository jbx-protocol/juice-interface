import { Button } from 'antd'

export const RewardItemButton: React.FC<
  React.PropsWithChildren<{ onClick?: VoidFunction }>
> = ({ onClick, children }) => {
  return (
    <Button
      className="text-2xl md:p-0 md:text-base"
      type="link"
      onClick={onClick}
    >
      {children}
    </Button>
  )
}
