import { Trans } from '@lingui/macro'
import ParticipantsModal from 'components/modals/ParticipantsModal'
import { TextButton } from 'components/TextButton'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useContext, useState } from 'react'
import { formatWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function TotalSupplyDescription() {
  const { tokenSymbol, tokenAddress, totalTokenSupply } =
    useContext(V2V3ProjectContext)

  const [participantsModalVisible, setParticipantsModalVisible] =
    useState<boolean>(false)

  const tokenText = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  return (
    <>
      <div>
        <div>
          {formatWad(totalTokenSupply, { precision: 0 })} {tokenText}
        </div>
        <TextButton onClick={() => setParticipantsModalVisible(true)}>
          <Trans>Holders</Trans>
        </TextButton>
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
