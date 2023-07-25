import { useHasNftRewards } from 'hooks/JB721Delegate/useHasNftRewards'
import { useJBWallet } from 'hooks/Wallet'
import { ManageNftsSection } from '../ManageNftsSection/ManageNftsSection'
import { V2V3ManageTokensSection } from '../V2V3ManageTokensSection'

export default function TokensTab() {
  const { isConnected } = useJBWallet()
  const { value: hasNftRewards } = useHasNftRewards()

  return (
    <>
      <section>
        <V2V3ManageTokensSection />
      </section>

      {hasNftRewards && isConnected ? (
        <section className="mt-6">
          <ManageNftsSection />
        </section>
      ) : null}
    </>
  )
}
