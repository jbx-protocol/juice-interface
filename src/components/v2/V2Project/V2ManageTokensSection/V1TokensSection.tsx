import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import useTerminalOfProject from 'hooks/v1/contractReader/TerminalOfProject'
import { useV1ProjectIdOf } from 'hooks/v2/contractReader/V1ProjectIdOf'
import { getTerminalName } from 'utils/v1/terminals'
import useTotalV1BalanceOf from 'hooks/v1/contractReader/TotalBalanceOf'
import { NetworkContext } from 'contexts/networkContext'
import { CSSProperties, useContext, useState } from 'react'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { formatWad, fromWad } from 'utils/formatNumber'
import { MigrateProjectTokensModal } from 'components/modals/MigrateProjectTokensModal'
import useHandleForProjectId from 'hooks/v1/contractReader/HandleForProjectId'
import useSymbolOfERC20 from 'hooks/SymbolOfERC20'
import useTokenAddressOfProject from 'hooks/v1/contractReader/TokenAddressOfProject'

export function V1TokensSection({
  tokenText,
  v2ProjectName,
  style,
}: {
  tokenText: string
  v2ProjectName?: string
  style?: CSSProperties
}) {
  const { userAddress } = useContext(NetworkContext)
  const { isPreviewMode, projectId } = useContext(V2ProjectContext)

  const [migrateTokensModalVisible, setMigrateTokensModalVisible] =
    useState<boolean>(false)

  const { data: v1ProjectId } = useV1ProjectIdOf(projectId)
  const v1ProjectHandle = useHandleForProjectId(v1ProjectId)
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

  return (
    <>
      <div style={{ ...style }}>
        <span>
          {formatWad(v1TokenBalance, { precision: 0 }) ?? 0} {tokenText}
        </span>

        {v1TokenBalance?.gt(0) && (
          <Button
            size="small"
            onClick={() => setMigrateTokensModalVisible(true)}
            disabled={isPreviewMode}
          >
            <Trans>Swap for V2 {tokenText}</Trans>
          </Button>
        )}
      </div>
      {v2ProjectName && v1TokenBalance && v1ProjectHandle && (
        <MigrateProjectTokensModal
          v1TokenBalance={parseInt(fromWad(v1TokenBalance))}
          v1TokenSymbol={v1TokenSymbol}
          v1ProjectHandle={v1ProjectHandle}
          v2ProjectName={v2ProjectName}
          visible={migrateTokensModalVisible}
          onCancel={() => setMigrateTokensModalVisible(false)}
        />
      )}
    </>
  )
}
