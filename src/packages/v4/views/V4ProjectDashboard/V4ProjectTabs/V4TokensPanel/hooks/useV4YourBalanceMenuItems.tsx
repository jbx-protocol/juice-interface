import {
  PlusCircleIcon,
  ReceiptRefundIcon
} from '@heroicons/react/24/outline'
import { useJBProjectId, useReadJbTokensCreditBalanceOf } from 'juice-sdk-react'
import { ReactNode, useMemo, useState } from 'react'

import { t } from '@lingui/macro'
import { PopupMenuItem } from 'components/ui/PopupMenu'
import { useWallet } from 'hooks/Wallet'
import { zeroAddress } from 'viem'
import { useV4BalanceMenuItemsUserFlags } from './useV4BalanceMenuItemsUserFlags'

export const useV4YourBalanceMenuItems = () => {
  const { canBurnTokens, canClaimErcTokens, canMintTokens } =
    useV4BalanceMenuItemsUserFlags()

  const [redeemModalVisible, setRedeemModalVisible] = useState(false)
  const [claimTokensModalVisible, setClaimTokensModalVisible] = useState(false)
  const [mintModalVisible, setMintModalVisible] = useState(false)
  const [
    transferUnclaimedTokensModalVisible,
    setTransferUnclaimedTokensModalVisible,
  ] = useState(false)

  const { userAddress } = useWallet()

  const { projectId, chainId } = useJBProjectId()

  const { data: unclaimedBalance } = useReadJbTokensCreditBalanceOf({
    args: [userAddress ?? zeroAddress, projectId ?? 0n],
    chainId
  })

  const items = useMemo(() => {
    const tokenMenuItems: PopupMenuItem[] = []
    // V4TODO:
    // if (canBurnTokens) {
    //   tokenMenuItems.push({
    //     id: 'burn',
    //     label: (
    //       <TokenItemLabel
    //         label={t`Burn token`}
    //         icon={<FireIcon className="h-5 w-5" />}
    //       />
    //     ),
    //     onClick: () => setRedeemModalVisible(true),
    //   })
    // }
    if (canClaimErcTokens) {
      tokenMenuItems.push({
        id: 'claim',
        label: (
          <TokenItemLabel
            label={t`Claim tokens as ERC-20`}
            icon={<ReceiptRefundIcon className="h-5 w-5" />}
          />
        ),
        onClick: () => setClaimTokensModalVisible(true),
      })
    }
    if (canMintTokens) {
      tokenMenuItems.push({
        id: 'mint',
        label: (
          <TokenItemLabel
            label={t`Mint tokens`}
            icon={<PlusCircleIcon className="h-5 w-5" />}
          />
        ),
        onClick: () => setMintModalVisible(true),
      })
    }
    // if (canTransferTokens) {
    //   tokenMenuItems.push({
    //     id: 'transfer',
    //     label: (
    //       <TokenItemLabel
    //         label={t`Transfer unclaimed tokens`}
    //         icon={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
    //       />
    //     ),
    //     onClick: () => setTransferUnclaimedTokensModalVisible(true),
    //   })
    // }
    return tokenMenuItems
  }, [canClaimErcTokens, canMintTokens])

  return {
    items,
    redeemModalVisible,
    setRedeemModalVisible,
    claimTokensModalVisible,
    setClaimTokensModalVisible,
    mintModalVisible,
    setMintModalVisible,
    transferUnclaimedTokensModalVisible,
    setTransferUnclaimedTokensModalVisible,
    unclaimedBalance
  }
}

const TokenItemLabel = ({
  label,
  icon,
}: {
  label: ReactNode
  icon: ReactNode
}) => (
  <>
    {icon}
    <span className="whitespace-nowrap text-sm font-medium">{label}</span>
  </>
)
