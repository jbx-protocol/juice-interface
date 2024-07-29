import { BigNumber } from '@ethersproject/bignumber'
import ParticipantsModal from 'components/modals/ParticipantsModal'
import useNameOfERC20 from 'hooks/ERC20/useNameOfERC20'
import { useReadJbTokensTokenOf } from 'juice-sdk-react'
import { useV4TotalTokenSupply } from '../hooks/useV4TotalTokenSupply'

export const V4TokenHoldersModal = ({
  open,
  onClose,
}: {
  open: boolean
  onClose: VoidFunction
}) => {
  const { data: tokenAddress } = useReadJbTokensTokenOf()
  const { data: tokenSymbol } = useNameOfERC20(tokenAddress)

  const { data: totalTokenSupply } = useV4TotalTokenSupply()
  return (
    <ParticipantsModal
      tokenSymbol={tokenSymbol}
      tokenAddress={tokenAddress}
      totalTokenSupply={totalTokenSupply ? BigNumber.from(totalTokenSupply.toString()): undefined}
      open={open}
      onCancel={onClose}
    />
  )
}
