import { Button, ButtonProps } from 'antd'
import { PropsWithChildren } from 'react'

type TransactorButtonProps = PropsWithChildren<
  ButtonProps & {
    text: string | JSX.Element
    connectWalletText?: string | JSX.Element
  }
>

export default function TransactorButton(props: TransactorButtonProps) {
  const buttonText = props.disabled ? props.connectWalletText : props.text
  return (
    <Button {...props}>
      <span>{buttonText}</span>
    </Button>
  )
}
