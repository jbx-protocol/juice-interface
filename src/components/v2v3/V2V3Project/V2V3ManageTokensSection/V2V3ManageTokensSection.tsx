import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { Descriptions, Space } from 'antd'
import { IssueErc20TokenButton } from 'components/IssueErc20TokenButton'
import SectionHeader from 'components/SectionHeader'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { useWallet } from 'hooks/Wallet'
import { V2OperatorPermission } from 'models/v2v3/permissions'
import { CSSProperties, useContext } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { reloadWindow } from 'utils/windowUtils'
import { AccountBalanceDescription } from './AccountBalanceDescription'
import { ProjectTokenDescription } from './ProjectTokenDescription'
import { TotalSupplyDescription } from './TotalSupplyDescription'
import { LegacyProjectTokensDescription } from './LegacyProjectTokensDescription'
import { LegacyProjectTokensDescriptionHeading } from './LegacyProjectTokensDescription'

const labelStyle: CSSProperties = {
  width: '10.5rem',
}
const contentStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 5,
  justifyContent: 'space-between',
  width: '10.5rem',
}

export function V2V3ManageTokensSection() {
  const { tokenAddress, tokenSymbol } = useContext(V2V3ProjectContext)
  const { userAddress } = useWallet()
  const hasIssueTicketsPermission = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.ISSUE,
  )

  const hasIssuedERC20 = tokenAddress && tokenAddress !== constants.AddressZero
  const showIssueErc20TokenButton = !hasIssuedERC20 && hasIssueTicketsPermission

  const v1TokenSwapEnabled = featureFlagEnabled(FEATURE_FLAGS.V1_TOKEN_SWAP)
  const showV1ProjectTokensSection = v1TokenSwapEnabled

  const tokenText = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
    includeTokenWord: true,
  })

  return (
    <Space direction="vertical" size="small">
      <div className="flex flex-wrap justify-between gap-x-1">
        <SectionHeader
          text={<Trans>Tokens</Trans>}
          tip={
            <Trans>
              {tokenText} are distributed to anyone who pays this project. If
              the project has a distribution limit, tokens can be redeemed for a
              portion of the project's overflow.
            </Trans>
          }
        />
        {showIssueErc20TokenButton && (
          <IssueErc20TokenButton onCompleted={reloadWindow} />
        )}
      </div>
      <Descriptions layout="horizontal" column={1}>
        {hasIssuedERC20 && tokenSymbol && (
          <Descriptions.Item label={t`Project token`} labelStyle={labelStyle}>
            <ProjectTokenDescription />
          </Descriptions.Item>
        )}
        <Descriptions.Item
          label={t`Total supply`}
          labelStyle={labelStyle}
          contentStyle={contentStyle}
        >
          <TotalSupplyDescription />
        </Descriptions.Item>

        {userAddress ? (
          <>
            <Descriptions.Item
              label={t`Your balance`}
              labelStyle={labelStyle}
              contentStyle={contentStyle}
              className="pb-0"
            >
              <AccountBalanceDescription />
            </Descriptions.Item>

            {showV1ProjectTokensSection && (
              <Descriptions.Item
                label={<LegacyProjectTokensDescriptionHeading />}
                labelStyle={labelStyle}
                contentStyle={contentStyle}
              >
                <LegacyProjectTokensDescription />
              </Descriptions.Item>
            )}
          </>
        ) : null}
      </Descriptions>
    </Space>
  )
}
