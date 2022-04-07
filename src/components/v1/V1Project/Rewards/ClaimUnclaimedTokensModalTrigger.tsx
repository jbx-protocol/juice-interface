import { Trans } from '@lingui/macro'
import RichButton from 'components/shared/RichButton'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import useUnclaimedBalanceOfUser from 'hooks/v1/contractReader/UnclaimedBalanceOfUser'
import { useUnstakeTokensTx } from 'hooks/v1/transactor/UnstakeTokensTx'
import { useContext, useState } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import ClaimUnclaimedTokensModal from 'components/shared/modals/ClaimUnclaimedTokensModal'

export function ClaimUnclaimedTokensModalTrigger() {
  const { tokenSymbol } = useContext(V1ProjectContext)

  const [
    claimUnclaimedTokensModalVisible,
    setClaimUnclaimedTokensModalVisible,
  ] = useState<boolean>(false)

  const tokensLabel = tokenSymbolText({
    tokenSymbol: tokenSymbol,
    capitalize: false,
    plural: true,
  })
  const unclaimedBalance = useUnclaimedBalanceOfUser()

  return (
    <>
      <RichButton
        heading={<Trans>Claim {tokensLabel} as ERC-20</Trans>}
        description={
          <Trans>
            Move your {tokensLabel} from the Juicebox contract to your wallet.
          </Trans>
        }
        onClick={() => setClaimUnclaimedTokensModalVisible(true)}
      />
      <ClaimUnclaimedTokensModal
        visible={claimUnclaimedTokensModalVisible}
        onCancel={() => setClaimUnclaimedTokensModalVisible(false)}
        unclaimedBalance={unclaimedBalance}
        useClaimUnclaimedTokensTx={useUnstakeTokensTx}
      />
    </>
  )
}
