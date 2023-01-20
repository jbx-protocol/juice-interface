import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { MigrateProjectTokensModal } from 'components/v2v3/V2V3Project/V2V3ManageTokensSection/V1ProjectTokensDescription/MigrateV1ProjectTokensModal'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useV1ProjectId } from 'hooks/JBV3Token/contractReader/V1ProjectId'
import { useV1TokenBalance } from 'hooks/JBV3Token/contractReader/V1TokenBalance'
import useSymbolOfERC20 from 'hooks/SymbolOfERC20'
import { default as useV1HandleForProjectId } from 'hooks/v1/contractReader/HandleForProjectId'
import useTokenAddressOfProject from 'hooks/v1/contractReader/TokenAddressOfProject'
import { useContext, useState } from 'react'
import { formatWad, fromWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function V1ProjectTokensDescription() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { tokenSymbol } = useContext(V2V3ProjectContext)

  const [migrateTokensModalVisible, setMigrateTokensModalVisible] =
    useState<boolean>(false)

  const { value: v1ProjectId } = useV1ProjectId()
  const v1TokenAddress = useTokenAddressOfProject(projectId)
  const { data: v1TokenSymbol } = useSymbolOfERC20(v1TokenAddress)

  const v1TokenBalance = useV1TokenBalance()
  // TODO add v2 balance here
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
          <Trans>Migrate tokens</Trans>
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
