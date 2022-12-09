import * as constants from '@ethersproject/constants'
import { t, Trans } from '@lingui/macro'
import { Descriptions, Space } from 'antd'
import { IssueErc20TokenButton } from 'components/IssueErc20TokenButton'
import SectionHeader from 'components/SectionHeader'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useV1ProjectIdOfV2Project } from 'hooks/v2v3/contractReader/V1ProjectIdOfV2Project'
import { useV2ConnectedWalletHasPermission } from 'hooks/v2v3/contractReader/V2ConnectedWalletHasPermission'
import { useHasV1TokenPaymentTerminal } from 'hooks/v2v3/hasV1TokenPaymentTerminal'
import { useWallet } from 'hooks/Wallet'
import { V2OperatorPermission } from 'models/v2v3/permissions'
import { CSSProperties, useContext } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { reloadWindow } from 'utils/windowUtils'
import { AccountBalanceDescription } from './AccountBalanceDescription/AccountBalanceDescription'
import { ProjectTokenDescription } from './ProjectTokenDescription/ProjectTokenDescription'
import { TotalSupplyDescription } from './TotalSupplyDescription'
import { V1ProjectTokensDescription } from './V1ProjectTokensDescription'
import { V1ProjectTokensDescriptionHeading } from './V1ProjectTokensDescription/V1ProjectTokensDescriptionHeading'

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
  const { projectId } = useContext(ProjectMetadataContext)

  const { userAddress } = useWallet()
  const { data: v1ProjectId } = useV1ProjectIdOfV2Project(projectId)
  const hasV1TokenPaymentTerminal = useHasV1TokenPaymentTerminal()
  const hasIssueTicketsPermission = useV2ConnectedWalletHasPermission(
    V2OperatorPermission.ISSUE,
  )

  const hasIssuedERC20 = tokenAddress !== constants.AddressZero
  const showIssueErc20TokenButton = !hasIssuedERC20 && hasIssueTicketsPermission

  const v1TokenSwapEnabled = featureFlagEnabled(FEATURE_FLAGS.V1_TOKEN_SWAP)
  const hasV1ProjectId = Boolean(v1ProjectId?.toNumber() ?? 0 > 0)
  const showV1ProjectTokensSection =
    v1TokenSwapEnabled && hasV1ProjectId && hasV1TokenPaymentTerminal

  const tokenText = tokenSymbolText({
    tokenSymbol,
    capitalize: true,
    plural: true,
    includeTokenWord: true,
  })

  return (
    <Space direction="vertical">
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
        {hasIssuedERC20 && tokenSymbol && <ProjectTokenDescription />}
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
                label={
                  <V1ProjectTokensDescriptionHeading
                    v1ProjectId={v1ProjectId}
                  />
                }
                labelStyle={labelStyle}
                contentStyle={contentStyle}
              >
                <V1ProjectTokensDescription />
              </Descriptions.Item>
            )}
          </>
        ) : null}
      </Descriptions>
    </Space>
  )
}
