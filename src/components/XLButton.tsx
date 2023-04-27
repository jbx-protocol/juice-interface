import { Button } from 'antd'
import { ButtonProps } from 'antd/lib/button/button'
import { PropsWithChildren } from 'react'
import { classNames } from 'utils/classNames'

export function XLButton({
  children,
  className,
  ...props
}: PropsWithChildren<{ className?: string } & ButtonProps>) {
  return (
    <Button
      {...props}
      className={classNames('h-12 w-full md:h-[60px] md:w-auto', className)}
    >
      {children}
    </Button>
  )
}
