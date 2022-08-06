import { ConnectButton as RainbowKitConnectButton } from '@rainbow-me/rainbowkit'

export default function ConnectButton() {
  return (
    <RainbowKitConnectButton
      accountStatus="avatar"
      chainStatus="icon"
      showBalance
    />
  )
}
