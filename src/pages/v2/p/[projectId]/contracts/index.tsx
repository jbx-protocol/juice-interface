import { AppWrapper } from 'components/common/CoreAppWrapper/CoreAppWrapper'
import { V2V3ProjectContractsDashboard } from 'components/v2v3/V2V3Project/V2V3ProjectContractsDashboard/V2V3ProjectContractsDashboard'
import { TransactionProvider } from 'contexts/Transaction/TransactionProvider'
import { V2V3ProjectPageProvider } from 'contexts/v2v3/V2V3ProjectPageProvider'
import { useRouter } from 'next/router'
import globalGetServerSideProps from 'utils/next-server/globalGetServerSideProps'

export default function V2V3ProjectContractsPage() {
  const router = useRouter()

  const { projectId: rawProjectId } = router.query
  if (!rawProjectId) return null

  const projectId = parseInt(rawProjectId as string)

  return (
    <AppWrapper>
      <V2V3ProjectPageProvider projectId={projectId}>
        <TransactionProvider>
          <V2V3ProjectContractsDashboard />
        </TransactionProvider>
      </V2V3ProjectPageProvider>
    </AppWrapper>
  )
}

export const getServerSideProps = globalGetServerSideProps
