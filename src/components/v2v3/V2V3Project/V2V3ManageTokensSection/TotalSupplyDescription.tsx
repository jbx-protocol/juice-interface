import { Trans } from '@lingui/macro'
import { TokenAmount } from 'components/TokenAmount'
import { TextButton } from 'components/buttons/TextButton'
import ParticipantsModal from 'components/modals/ParticipantsModal'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useContext, useState } from 'react'

export function TotalSupplyDescription() {
  const { tokenSymbol, tokenAddress, totalTokenSupply } =
    useContext(V2V3ProjectContext)

  const [participantsModalVisible, setParticipantsModalVisible] =
    useState<boolean>(false)

  if (!totalTokenSupply) return null

  return (
    <>
      <div>
        <div>
          <TokenAmount amountWad={totalTokenSupply} tokenSymbol={tokenSymbol} />
        </div>
        {totalTokenSupply.gt(0) ? (
          <TextButton onClick={() => setParticipantsModalVisible(true)}>
            <Trans>Holders</Trans>
          </TextButton>
        ) : null}
      </div>
      <ParticipantsModal
        tokenSymbol={tokenSymbol}
        tokenAddress={tokenAddress}
        totalTokenSupply={totalTokenSupply}
        open={participantsModalVisible}
        onCancel={() => setParticipantsModalVisible(false)}
      />
    </>
  )
}
