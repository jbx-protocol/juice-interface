import { Button } from 'antd'
import useMobile from 'hooks/Mobile'
import { classNames } from 'utils/classNames'

export const RewardItemButton: React.FC<{ onClick?: VoidFunction }> = ({
  onClick,
  children,
}) => {
  const isMobile = useMobile()
  return (
    <div
      className={classNames(isMobile ? 'flex h-11 w-11 justify-center' : '')}
    >
      <Button className="text-2xl md:p-0" type="link" onClick={onClick}>
        {children}
      </Button>
    </div>
  )
}
