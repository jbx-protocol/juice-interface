import { useRouter } from 'next/router'
import { useCallback, useEffect } from 'react'

type ProjectPageTab =
  | 'about'
  | 'nft_rewards'
  | 'cycle_payouts'
  | 'tokens'
  | 'activity'

export const useProjectPageQueries = () => {
  const router = useRouter()
  const { projectId } = router.query

  const projectPageTab = (router.query.tabid as ProjectPageTab) || 'about'

  const setProjectPageTab = useCallback(
    (tabId: string) => {
      router.push(
        { pathname: router.pathname, query: { tabid: tabId, projectId } },
        undefined,
        { shallow: true },
      )
    },
    [projectId, router],
  )

  useEffect(() => {
    const tabId = router.query.tabid as ProjectPageTab
    if (tabId && tabId !== projectPageTab) {
      setProjectPageTab(tabId)
    }
  }, [projectPageTab, router.query.tabid, setProjectPageTab])

  return {
    projectPageTab,
    setProjectPageTab,
  }
}
