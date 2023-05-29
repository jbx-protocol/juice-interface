import { AppWrapper } from 'components/common'
import { TransactionProvider } from 'contexts/Transaction/TransactionProvider'
import { V2V3ProjectPageProvider } from 'contexts/v2v3/V2V3ProjectPageProvider'
import { useRouter } from 'next/router'
import { Provider } from 'react-redux'
import store from 'redux/store'

export const V2V3SettingsProvider: React.FC<React.PropsWithChildren> = ({
  children,
}) => {
  const router = useRouter()

  const { projectId: rawProjectId } = router.query
  if (!rawProjectId) return null

  const projectId = parseInt(rawProjectId as string)

  return (
    <AppWrapper hideNav>
      <Provider store={store}>
        <V2V3ProjectPageProvider projectId={projectId}>
          <TransactionProvider>{children}</TransactionProvider>
        </V2V3ProjectPageProvider>
      </Provider>
    </AppWrapper>
  )
}
