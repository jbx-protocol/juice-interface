import { useProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useRouter } from 'next/router'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useProjectPageQueries } from './useProjectPageQueries'

export const useSuccessPayView = () => {
  const router = useRouter()
  const { name, nftPaymentSuccessModal } =
    useProjectMetadataContext().projectMetadata ?? {}
  const { projectPayReceipt, setProjectPayReceipt } = useProjectPageQueries()
  const nftsPurchased = useMemo(
    () => !!projectPayReceipt?.nfts.length,
    [projectPayReceipt?.nfts.length],
  )
  const tokensReceivedDuringTx = useMemo(
    () =>
      projectPayReceipt
        ? projectPayReceipt.tokensReceived.length &&
          projectPayReceipt.tokensReceived !== '0'
        : false,
    [projectPayReceipt],
  )

  const [confettiVisible, setConfettiVisible] = useState(true)

  const projectId = useMemo(() => {
    if (!router.isReady) return
    if (router.query.projectId === undefined) return
    const projectId = parseInt(router.query.projectId as string)
    if (isNaN(projectId)) return
    return projectId
  }, [router.isReady, router.query.projectId])

  useEffect(() => {
    const timer = setTimeout(() => {
      setConfettiVisible(false)
    }, 4000)
    return () => clearTimeout(timer)
  })

  const returnToProject = useCallback(() => {
    setProjectPayReceipt(undefined)
  }, [setProjectPayReceipt])

  return {
    projectId,
    name,
    projectPayReceipt,
    nftPaymentSuccessModal,
    nftsPurchased,
    tokensReceivedDuringTx,
    confettiVisible,
    returnToProject,
  }
}
