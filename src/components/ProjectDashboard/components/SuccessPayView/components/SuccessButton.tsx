import { Button } from 'antd'
import { ReactNode } from 'react'

export const SuccessButton = ({
  icon,
  text,
  onClick,
}: {
  icon: ReactNode
  text: ReactNode
  onClick?: () => void
}) => (
  <Button
    className="flex items-center gap-2 py-2 px-3.5 font-medium"
    type="link"
    icon={icon}
    onClick={onClick}
  >
    {text}
  </Button>
)
