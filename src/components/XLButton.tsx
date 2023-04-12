import { Button } from 'antd'
import { BaseButtonProps } from 'antd/lib/button/button'
import { PropsWithChildren } from 'react'
import { classNames } from 'utils/classNames'

export function XLButton({
  children,
  className,
  ...props
}: PropsWithChildren<{ className?: string } & BaseButtonProps>) {
  return (
    <Button
      {...props}
      className={classNames('md:w-unset h-12 w-full md:h-[60px]', className)}
    >
      {children}
    </Button>
  )
}
