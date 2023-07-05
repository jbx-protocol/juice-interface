import {
  ArrowRightOnRectangleIcon,
  FireIcon,
  PlusCircleIcon,
  ReceiptRefundIcon,
} from '@heroicons/react/24/outline'
import { t } from '@lingui/macro'
import { ReactNode, useMemo, useState } from 'react'
import { PopupMenuItem } from '../../components/PopupMenu/PopupMenu'
import { useBalanceMenuItemsUserFlags } from './useBalanceMenuItemsUserFlags'

export const useYourBalanceMenuItems = () => {
  const { canBurnTokens, canClaimErcTokens, canMintTokens, canTransferTokens } =
    useBalanceMenuItemsUserFlags()

  const [redeemModalVisible, setRedeemModalVisible] = useState(false)
  const [claimTokensModalVisible, setClaimTokensModalVisible] = useState(false)
  const [mintModalVisible, setMintModalVisible] = useState(false)
  const [
    transferUnclaimedTokensModalVisible,
    setTransferUnclaimedTokensModalVisible,
  ] = useState(false)

  const items = useMemo(() => {
    const tokenMenuItems: PopupMenuItem[] = []
    if (canBurnTokens) {
      tokenMenuItems.push({
        id: 'burn',
        label: (
          <TokenItemLabel
            label={t`Burn token`}
            icon={<FireIcon className="h-5 w-5" />}
          />
        ),
        onClick: () => setRedeemModalVisible(true),
      })
    }
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
    if (canTransferTokens) {
      tokenMenuItems.push({
        id: 'transfer',
        label: (
          <TokenItemLabel
            label={t`Transfer unclaimed tokens`}
            icon={<ArrowRightOnRectangleIcon className="h-5 w-5" />}
          />
        ),
        onClick: () => setTransferUnclaimedTokensModalVisible(true),
      })
    }
    return tokenMenuItems
  }, [canBurnTokens, canClaimErcTokens, canMintTokens, canTransferTokens])

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
