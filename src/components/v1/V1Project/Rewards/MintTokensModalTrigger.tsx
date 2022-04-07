import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import RichButton from 'components/shared/RichButton'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import useCanPrintPreminedTokens from 'hooks/v1/contractReader/CanPrintPreminedTokens'
import {
  OperatorPermission,
  useHasPermission,
} from 'hooks/v1/contractReader/HasPermission'
import { useContext, useState } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { decodeFundingCycleMetadata } from 'utils/v1/fundingCycle'

import PrintPreminedModal from '../modals/PrintPreminedModal'

export default function MintTokensModalTrigger() {
  const { projectId, currentFC, tokenSymbol } = useContext(V1ProjectContext)
  const [mintModalVisible, setMintModalVisible] = useState<boolean>()

  const metadata = decodeFundingCycleMetadata(currentFC?.metadata)

  const canPrintPreminedV1Tickets = useCanPrintPreminedTokens()
  const hasPrintPreminePermission = useHasPermission(
    OperatorPermission.PrintTickets,
  )

  const mintingTokensIsAllowed =
    metadata &&
    (metadata.version === 0
      ? canPrintPreminedV1Tickets
      : metadata.ticketPrintingIsAllowed)

  const tokensLabel = tokenSymbolText({
    tokenSymbol: tokenSymbol,
    capitalize: false,
    plural: true,
  })

  return (
    <>
      {hasPrintPreminePermission && projectId?.gt(0) && (
        <Tooltip
          title={
            <Trans>
              Token minting is only available for V1.1 projects. Token minting
              can be enabled or disabled by reconfiguring the project's funding
              cycle.
            </Trans>
          }
          placement="right"
        >
          <RichButton
            heading={<Trans>Mint {tokensLabel}</Trans>}
            description={
              <Trans>
                Mint new {tokensLabel} into an account. Only a project's owner,
                a designated operator, or one of its terminal's delegates can
                mint its tokens.
              </Trans>
            }
            onClick={() => setMintModalVisible(true)}
            disabled={!mintingTokensIsAllowed}
          />
        </Tooltip>
      )}
      <PrintPreminedModal
        visible={mintModalVisible}
        onCancel={() => setMintModalVisible(false)}
      />
    </>
  )
}
