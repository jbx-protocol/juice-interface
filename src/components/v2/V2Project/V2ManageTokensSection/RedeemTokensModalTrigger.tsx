import { Trans } from '@lingui/macro'
import { RedeemButtonTooltip } from 'components/shared/modals/ManageTokensModal'
import RichButton from 'components/shared/RichButton'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useContext, useState } from 'react'
import { useHistory } from 'react-router-dom'
import { tokenSymbolText } from 'utils/tokenSymbolText'

import V2RedeemModal from './V2RedeemModal'

export default function RedeemTokensModalTrigger() {
  const { tokenSymbol, primaryTerminalCurrentOverflow } =
    useContext(V2ProjectContext)
  const tokensLabel = tokenSymbolText({
    tokenSymbol: tokenSymbol,
    capitalize: false,
  })

  const [redeemModalVisible, setRedeemModalVisible] = useState<boolean>(false)

  const history = useHistory()

  const redeemDisabled = !Boolean(primaryTerminalCurrentOverflow?.gt(0))
  return (
    <>
      <RedeemButtonTooltip buttonDisabled={redeemDisabled}>
        <RichButton
          heading={<Trans>Redeem {tokensLabel} for ETH</Trans>}
          description={
            <Trans>
              Redeem your {tokensLabel} for a portion of the project's overflow.
              Any {tokensLabel} you redeem will be burned.
            </Trans>
          }
          onClick={() => setRedeemModalVisible(true)}
          disabled={redeemDisabled}
        />
      </RedeemButtonTooltip>
      <V2RedeemModal
        visible={redeemModalVisible}
        onOk={() => {
          setRedeemModalVisible(false)

          // refresh page
          history.go(0)
        }}
        onCancel={() => {
          setRedeemModalVisible(false)
        }}
      />
    </>
  )
}
