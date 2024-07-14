import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import useERC20BalanceOf from 'hooks/ERC20/useERC20BalanceOf'
import { useWallet } from 'hooks/Wallet'
import useTotalBalanceOf from 'packages/v2v3/hooks/contractReader/useTotalBalanceOf'
import { useContext } from 'react'
import { useProjectContext } from './useProjectContext'

export const useUnclaimedTokenBalance = () => {
  const { projectId } = useContext(ProjectMetadataContext)
  const { tokenAddress } = useProjectContext()
  const { userAddress } = useWallet()
  const { data: claimedBalance } = useERC20BalanceOf(tokenAddress, userAddress)
  const { data: totalBalance } = useTotalBalanceOf(userAddress, projectId)

  if (
    typeof claimedBalance === 'undefined' ||
    typeof totalBalance === 'undefined'
  ) {
    return undefined
  }

  return totalBalance.sub(claimedBalance)
}
