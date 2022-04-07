import { Trans } from '@lingui/macro'
import { Tooltip } from 'antd'
import {
  BurnTokensHelp,
  RedeemButtonTooltip,
} from 'components/shared/modals/ManageTokensModal'
import RichButton from 'components/shared/RichButton'
import RedeemModal from 'components/v1/V1Project/modals/RedeemModal'
import { V1ProjectContext } from 'contexts/v1/projectContext'
import { useContext, useState } from 'react'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export default function RedeemTokensModalTrigger() {
  const { tokenSymbol, overflow } = useContext(V1ProjectContext)

  const [redeemModalVisible, setRedeemModalVisible] = useState<boolean>(false)

  const redeemDisabled = !overflow?.gt(0)

  const tokensLabel = tokenSymbolText({
    tokenSymbol: tokenSymbol,
    capitalize: false,
    plural: true,
  })

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
      {redeemDisabled && (
        <Tooltip title={<BurnTokensHelp />} placement="right">
          <RichButton
            heading={<Trans>Burn {tokensLabel}</Trans>}
            description={
              <Trans>
                Burn your {tokensLabel}. You won't receive ETH in return because
                this project has no overflow.
              </Trans>
            }
            onClick={() => setRedeemModalVisible(true)}
          />
        </Tooltip>
      )}
      <RedeemModal
        visible={redeemModalVisible}
        onOk={() => {
          setRedeemModalVisible(false)
        }}
        onCancel={() => {
          setRedeemModalVisible(false)
        }}
      />
    </>
  )
}
