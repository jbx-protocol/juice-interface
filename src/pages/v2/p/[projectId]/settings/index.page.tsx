import { AppWrapper } from 'components/common'
import { V2V3ProjectSettings } from 'components/v2v3/V2V3Project/V2V3ProjectSettings'
import { TransactionProvider } from 'contexts/Transaction/TransactionProvider'
import { V2V3ProjectPageProvider } from 'contexts/v2v3/V2V3ProjectPageProvider'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'
import store from 'redux/store'

export default function V2V3ProjectSettingsPage() {
  const router = useRouter()

  const { projectId: rawProjectId } = router.query
  if (!rawProjectId) return null

  const projectId = parseInt(rawProjectId as string)

  return (
    <AppWrapper>
      <Provider store={store}>
        <V2V3ProjectPageProvider projectId={projectId}>
          <TransactionProvider>
            <V2V3ProjectSettings />
          </TransactionProvider>
        </V2V3ProjectPageProvider>
      </Provider>
    </AppWrapper>
  )
}
