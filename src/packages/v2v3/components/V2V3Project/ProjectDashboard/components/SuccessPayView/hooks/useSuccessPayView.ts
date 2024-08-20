import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { useContext, useEffect, useState } from 'react'
import { useProjectPageQueries } from '../../../hooks/useProjectPageQueries'

export const useSuccessPayView = () => {
  const { projectMetadata, projectId } = useProjectMetadataContext()
  const { handle } = useContext(V2V3ProjectContext)
  const { projectPayReceipt } = useProjectPageQueries()

  const [confettiVisible, setConfettiVisible] = useState(true)

  const { name, nftPaymentSuccessModal } = projectMetadata ?? {}

  const nftsPurchased = !!projectPayReceipt?.nfts.length
  const tokensReceivedDuringTx = projectPayReceipt
    ? projectPayReceipt.tokensReceived.length &&
      projectPayReceipt.tokensReceived !== '0'
    : false

  useEffect(() => {
    const timer = setTimeout(() => {
      setConfettiVisible(false)
    }, 4000)
    return () => clearTimeout(timer)
  })

  return {
    projectId,
    handle,
    name,
    projectPayReceipt,
    nftPaymentSuccessModal,
    nftsPurchased,
    tokensReceivedDuringTx,
    confettiVisible,
  }
}
