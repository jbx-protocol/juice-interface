import { useWallet } from 'hooks/Wallet'
import { ManageNftsSection } from '../ManageNftsSection/ManageNftsSection'
import { V2V3ManageTokensSection } from '../V2V3ManageTokensSection'

export default function TokensTab({
  hasNftRewards,
}: {
  hasNftRewards: boolean
}) {
  const { isConnected } = useWallet()

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
