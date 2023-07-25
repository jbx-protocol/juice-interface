import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import useERC20BalanceOf from 'hooks/ERC20/useERC20BalanceOf'
import { useJBWallet } from 'hooks/Wallet'
import useTotalBalanceOf from 'hooks/v2v3/contractReader/useTotalBalanceOf'
import { useContext } from 'react'
import { useProjectContext } from './useProjectContext'

export const useUnclaimedTokenBalance = () => {
  const { projectId } = useContext(ProjectMetadataContext)
  const { tokenAddress } = useProjectContext()
  const { userAddress } = useJBWallet()
  const { data: claimedBalance } = useERC20BalanceOf(tokenAddress, userAddress)
  const { data: totalBalance } = useTotalBalanceOf(userAddress, projectId)
  const unclaimedBalance = totalBalance?.sub(claimedBalance ?? 0)
  return unclaimedBalance
}
