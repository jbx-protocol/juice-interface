import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { useRouter } from 'next/router'
import qs from 'qs'
import { useCallback, useContext, useEffect, useState } from 'react'
import { v2v3ProjectRoute } from 'utils/routes'

export function useModalFromUrlQuery(paramName: string) {
  const { projectId } = useContext(ProjectMetadataContext)

  const [modalVisible, setModalVisible] = useState<boolean>(false)

  const { asPath, replace } = useRouter()

  useEffect(() => {
    // can't use router.query because it doesn't update when we remove the query parameter.
    const query = qs.parse(asPath.split('?')?.[1])

    const shouldShowModal = Boolean(query[paramName])
    setModalVisible(shouldShowModal)
  }, [asPath, paramName])

  const hide = useCallback(() => {
    setModalVisible(false)
    replace(v2v3ProjectRoute({ projectId }), undefined, {
      shallow: true,
    })
  }, [setModalVisible, replace, projectId])

  return { visible: modalVisible, hide }
}
