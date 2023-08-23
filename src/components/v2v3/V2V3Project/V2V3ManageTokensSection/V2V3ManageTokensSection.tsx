import { t, Trans } from '@lingui/macro'
import { Descriptions } from 'antd'
import { IssueErc20TokenButton } from 'components/buttons/IssueErc20TokenButton'
import SectionHeader from 'components/SectionHeader'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useProjectHasLegacyTokens } from 'hooks/JBV3Token/contractReader/useProjectHasLegacyTokens'
import { useV2V3WalletHasPermission } from 'hooks/v2v3/contractReader/useV2V3WalletHasPermission'
import { useProjectHasErc20 } from 'hooks/v2v3/useProjectHasErc20'
import { useWallet } from 'hooks/Wallet'
import { V2V3OperatorPermission } from 'models/v2v3/permissions'
import { CSSProperties, useContext } from 'react'
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
  alignItems: 'flex-start',
}

export function V2V3ManageTokensSection() {
  const { tokenSymbol } = useContext(V2V3ProjectContext)
  const { userAddress } = useWallet()
  const hasIssueTicketsPermission = useV2V3WalletHasPermission(
    V2V3OperatorPermission.ISSUE,
  )

  const hasIssuedERC20 = useProjectHasErc20()
  const showIssueErc20TokenButton = !hasIssuedERC20 && hasIssueTicketsPermission
  const showLegacyProjectTokensSection = useProjectHasLegacyTokens()

  const tokenText = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
    includeTokenWord: true,
  })

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap justify-between gap-x-1">
        <SectionHeader
          text={<Trans>Tokens</Trans>}
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
                <LegacyProjectTokensDescription />
              </Descriptions.Item>
            )}
          </>
        ) : null}
      </Descriptions>
    </div>
  )
}
