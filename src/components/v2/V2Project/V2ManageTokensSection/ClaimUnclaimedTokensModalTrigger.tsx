import { Trans } from '@lingui/macro'
import RichButton from 'components/shared/RichButton'
import ClaimUnclaimedTokensModal from 'components/shared/modals/ClaimUnclaimedTokensModal'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import useUserUnclaimedTokenBalance from 'hooks/v2/contractReader/UserUnclaimedTokenBalance'
import { useClaimUnclaimedTokensTx } from 'hooks/v2/transactor/ClaimUnclaimedTokensTx'

export default function ClaimUnclaimedTokensModalTrigger() {
  const { tokenSymbol } = useContext(V2ProjectContext)
  const tokensLabel = tokenSymbolText({
    tokenSymbol: tokenSymbol,
    capitalize: false,
  })

  const [
    claimUnclaimedTokensModalVisible,
    setClaimUnclaimedTokensModalVisible,
  ] = useState<boolean>(false)

  const history = useHistory()

  const { data: unclaimedBalance } = useUserUnclaimedTokenBalance()

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
        onOk={() => {
          setClaimUnclaimedTokensModalVisible(false)

          // refresh page
          history.go(0)
        }}
        onCancel={() => {
          setClaimUnclaimedTokensModalVisible(false)
        }}
        unclaimedBalance={unclaimedBalance}
        useClaimUnclaimedTokensTx={useClaimUnclaimedTokensTx}
      />
    </>
  )
}
