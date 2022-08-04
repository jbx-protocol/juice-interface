import RainbowKit from '@rainbow-me/rainbowkit'

export default function ConnectButton() {
  return (
    <RainbowKit.ConnectButton
      accountStatus="avatar"
      chainStatus="icon"
      showBalance
    />
  )
}
