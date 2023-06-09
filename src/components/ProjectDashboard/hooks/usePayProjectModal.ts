import { useWallet } from 'hooks/Wallet'
import { useCallback } from 'react'
import { useProjectCart } from './useProjectCart'

export const usePayProjectModal = () => {
  const { dispatch, payModalOpen } = useProjectCart()
  const { userAddress } = useWallet()

  const open = payModalOpen
  const setOpen = useCallback(
    (open: boolean) => {
      dispatch({ type: 'setPayModal', payload: { open } })
    },
    [dispatch],
  )

  const totalAmount = '2.4 ETH (US$4,326)'

  return { open, totalAmount, userAddress, setOpen }
}
