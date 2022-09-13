import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { MigrateProjectTokensModal } from 'components/v2/V2Project/V2ManageTokensSection/V1ProjectTokensSection/MigrateV1ProjectTokensModal'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import useSymbolOfERC20 from 'hooks/SymbolOfERC20'
import useTerminalOfProject from 'hooks/v1/contractReader/TerminalOfProject'
import useTokenAddressOfProject from 'hooks/v1/contractReader/TokenAddressOfProject'
import useTotalV1BalanceOf from 'hooks/v1/contractReader/TotalBalanceOf'
import { useV1ProjectIdOfV2Project } from 'hooks/v2/contractReader/V1ProjectIdOfV2Project'
import { useWallet } from 'hooks/Wallet'
import { CSSProperties, useContext, useState } from 'react'
import { formatWad, fromWad } from 'utils/format/formatNumber'
import { getTerminalName } from 'utils/v1/terminals'

export function V1ProjectTokensSection({
  v1ProjectHandle,
  tokenText,
  style,
}: {
  v1ProjectHandle: string
  tokenText: string
  style?: CSSProperties
}) {
  const { userAddress } = useWallet()
  const { projectId } = useContext(V2ProjectContext)

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
          >
            <Trans>Swap for V2 {tokenText}</Trans>
          </Button>
        )}
      </div>
      {v1TokenBalance && (
        <MigrateProjectTokensModal
          v1TokenBalance={parseInt(fromWad(v1TokenBalance))}
          v1TokenSymbol={v1TokenSymbol}
          v1ProjectHandle={v1ProjectHandle}
          visible={migrateTokensModalVisible}
          onCancel={() => setMigrateTokensModalVisible(false)}
        />
      )}
    </>
  )
}
