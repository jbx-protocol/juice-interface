import { Button } from 'antd'
import useMobile from 'hooks/Mobile'

export const RewardItemButton: React.FC<{ onClick?: VoidFunction }> = ({
  onClick,
  children,
}) => {
  const isMobile = useMobile()
  return (
    <div
      style={
        isMobile
          ? {
              width: '2.75rem',
              height: '2.75rem',
              display: 'flex',
              justifyContent: 'center',
            }
          : undefined
      }
    >
      <Button
        style={isMobile ? { fontSize: '1.5rem' } : { padding: 0 }}
        type="link"
        onClick={onClick}
      >
        {children}
      </Button>
    </div>
  )
}
