import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { MigrateProjectTokensModal } from 'components/v2v3/V2V3Project/V2V3ManageTokensSection/V1ProjectTokensDescription/MigrateV1ProjectTokensModal'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import useSymbolOfERC20 from 'hooks/SymbolOfERC20'
import { default as useV1HandleForProjectId } from 'hooks/v1/contractReader/HandleForProjectId'
import useTerminalOfProject from 'hooks/v1/contractReader/TerminalOfProject'
import useTokenAddressOfProject from 'hooks/v1/contractReader/TokenAddressOfProject'
import useTotalV1BalanceOf from 'hooks/v1/contractReader/TotalBalanceOf'
import { useV1ProjectIdOfV2Project } from 'hooks/v2v3/contractReader/V1ProjectIdOfV2Project'
import { useWallet } from 'hooks/Wallet'
import { useContext, useState } from 'react'
import { formatWad, fromWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'
import { getTerminalName } from 'utils/v1/terminals'

export function V1ProjectTokensDescription() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { tokenSymbol } = useContext(V2V3ProjectContext)

  const { userAddress } = useWallet()

  const [migrateTokensModalVisible, setMigrateTokensModalVisible] =
    useState<boolean>(false)

  const { data: v1ProjectId } = useV1ProjectIdOfV2Project(projectId)
  const v1TokenAddress = useTokenAddressOfProject(projectId)
  const v1TokenSymbol = useSymbolOfERC20(v1TokenAddress)
  const terminalAddress = useTerminalOfProject(v1ProjectId)
  const terminalName = getTerminalName({
    address: terminalAddress,
  })
  const v1TokenBalance = useTotalV1BalanceOf(
    userAddress,
    v1ProjectId,
    terminalName,
  )
  const v1ProjectHandle = useV1HandleForProjectId(v1ProjectId)

  const tokenText = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  if (!v1ProjectHandle) return null

  return (
    <>
      <span>
        {formatWad(v1TokenBalance, { precision: 0 }) ?? 0} {tokenText}
      </span>

      {v1TokenBalance?.gt(0) && (
        <Button size="small" onClick={() => setMigrateTokensModalVisible(true)}>
          <Trans>Swap for V2 {tokenText}</Trans>
        </Button>
      )}
      {v1TokenBalance && (
        <MigrateProjectTokensModal
          v1TokenBalance={parseInt(fromWad(v1TokenBalance))}
          v1TokenSymbol={v1TokenSymbol}
          v1ProjectHandle={v1ProjectHandle}
          open={migrateTokensModalVisible}
          onCancel={() => setMigrateTokensModalVisible(false)}
        />
      )}
    </>
  )
}
