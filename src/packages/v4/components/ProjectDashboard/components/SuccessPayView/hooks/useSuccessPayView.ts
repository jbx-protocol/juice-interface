import { useProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useProjectPageQueries } from 'packages/v4/views/V4ProjectDashboard/hooks/useProjectPageQueries'
import { useEffect, useState } from 'react'

export const useSuccessPayView = () => {
  const { projectMetadata, projectId } = useProjectMetadataContext()
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
    name,
    projectPayReceipt,
    nftPaymentSuccessModal,
    nftsPurchased,
    tokensReceivedDuringTx,
    confettiVisible,
  }
}
