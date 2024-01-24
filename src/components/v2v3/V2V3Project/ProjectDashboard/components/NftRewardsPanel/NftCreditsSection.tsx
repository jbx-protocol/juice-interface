import ETHAmount from 'components/currency/ETHAmount'
import { useNftCredits } from 'hooks/JB721Delegate/useNftCredits'
import { useWallet } from 'hooks/Wallet'

export function NftCreditsSection() {
  const { userAddress } = useWallet()

  const { data: credits } = useNftCredits(userAddress)

  return (
    <div>
      Your credits: <ETHAmount amount={credits} />
    </div>
  )
}
