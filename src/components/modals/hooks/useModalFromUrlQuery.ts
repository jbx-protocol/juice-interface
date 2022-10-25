import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { useRouter } from 'next/router'
import { useCallback, useContext, useMemo } from 'react'
import { v2v3ProjectRoute } from 'utils/routes'

export function useModalFromUrlQuery(paramName: string) {
  const router = useRouter()
  const { projectId } = useContext(ProjectMetadataContext)

  const modalVisible = useMemo(
    () => router.query[paramName] === '1',
    [paramName, router.query],
  )

  const hide = useCallback(() => {
    const query = router.query
    query[paramName] = '0'
    router.replace(
      { pathname: v2v3ProjectRoute({ projectId }), query },
      v2v3ProjectRoute({ projectId }),
      { shallow: true },
    )
  }, [router, paramName, projectId])

  return { visible: modalVisible, hide }
}
