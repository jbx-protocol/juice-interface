import { useCallback, useEffect, useMemo, useState } from 'react'
import { useProjectMetadata } from './useProjectMetadata'
import { useProjectPageQueries } from './useProjectPageQueries'

export const useSuccessPayView = () => {
  const { name, nftPaymentSuccessModal } =
    useProjectMetadata().projectMetadata ?? {}
  const { projectPayReceipt, setProjectPayReceipt } = useProjectPageQueries()
  const nftsPurchased = useMemo(
    () => !!projectPayReceipt?.nfts.length,
    [projectPayReceipt?.nfts.length],
  )
  const [confettiVisible, setConfettiVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setConfettiVisible(false)
    }, 2000)
    return () => clearTimeout(timer)
  })

  const returnToProject = useCallback(() => {
    setProjectPayReceipt(undefined)
  }, [setProjectPayReceipt])

  return {
    name,
    projectPayReceipt,
    nftPaymentSuccessModal,
    nftsPurchased,
    confettiVisible,
    returnToProject,
  }
}
