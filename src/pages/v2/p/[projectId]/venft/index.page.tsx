import { AppWrapper } from 'components/common'
import { VeNft } from 'components/veNft/VeNft'
import { useRouter } from 'next/router'
import { TransactionProvider } from 'providers/TransactionProvider'
import { V2V3ProjectPageProvider } from 'providers/v2v3/V2V3ProjectPageProvider'
import { VeNftProvider } from 'providers/v2v3/VeNftProvider'

export default function VeNftPage() {
  const router = useRouter()

  const { projectId: rawProjectId } = router.query
  if (!rawProjectId) return null

  const projectId = parseInt(rawProjectId as string)

  return (
    <AppWrapper>
      <V2V3ProjectPageProvider projectId={projectId}>
        <TransactionProvider>
          <VeNftProvider projectId={projectId}>
            <VeNft />
          </VeNftProvider>
        </TransactionProvider>
      </V2V3ProjectPageProvider>
    </AppWrapper>
  )
}
