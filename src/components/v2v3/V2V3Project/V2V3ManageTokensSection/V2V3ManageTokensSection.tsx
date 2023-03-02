import { t, Trans } from '@lingui/macro'
import { Descriptions, Space } from 'antd'
import { IssueErc20TokenButton } from 'components/buttons/IssueErc20TokenButton'
import SectionHeader from 'components/SectionHeader'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { V1UserProvider } from 'contexts/v1/User/V1UserProvider'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { useProjectHasErc20 } from 'hooks/v2v3/ProjectHasErc20'
import { useWallet } from 'hooks/Wallet'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import { CSSProperties, useContext } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { reloadWindow } from 'utils/windowUtils'
import { AccountBalanceDescription } from './AccountBalanceDescription'
import {
  LegacyProjectTokensDescription,
  LegacyProjectTokensDescriptionHeading,
} from './LegacyProjectTokensDescription'
import { ProjectTokenDescription } from './ProjectTokenDescription'
import { TotalSupplyDescription } from './TotalSupplyDescription'

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
  const { tokenSymbol } = useContext(V2V3ProjectContext)
  const { userAddress } = useWallet()
  const hasIssueTicketsPermission = useV2ConnectedWalletHasPermission(
    V2V3OperatorPermission.ISSUE,
  )

  const hasIssuedERC20 = useProjectHasErc20()
  const showIssueErc20TokenButton = !hasIssuedERC20 && hasIssueTicketsPermission

  const v1TokenSwapEnabled = featureFlagEnabled(FEATURE_FLAGS.V1_TOKEN_SWAP)
  const showLegacyProjectTokensSection = v1TokenSwapEnabled

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
          text={<Trans>Project tokens</Trans>}
          tip={
            <Trans>
              Anyone who pays this project receives {tokenText}. Depending on
              this project's rules, it may be possible to redeem {tokenText} to
              reclaim ETH.
            </Trans>
          }
        />
        {showIssueErc20TokenButton && (
          <IssueErc20TokenButton onCompleted={reloadWindow} />
        )}
      </div>
      <Descriptions layout="horizontal" column={1}>
        {hasIssuedERC20 && tokenSymbol && (
          <Descriptions.Item label={t`Token`} labelStyle={labelStyle}>
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

            {showLegacyProjectTokensSection && (
              <Descriptions.Item
                label={<LegacyProjectTokensDescriptionHeading />}
                labelStyle={labelStyle}
                contentStyle={contentStyle}
                className="pt-5"
              >
                <V1UserProvider>
                  <LegacyProjectTokensDescription />
                </V1UserProvider>
              </Descriptions.Item>
            )}
          </>
        ) : null}
      </Descriptions>
    </Space>
  )
}
