import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { MigrateProjectTokensModal } from 'components/v2v3/V2V3Project/V2V3ManageTokensSection/LegacyProjectTokensDescription/MigrateLegacyProjectTokensModal'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useTotalLegacyTokenBalance } from 'hooks/JBV3Token/contractReader/TotalLegacyTokenBalance'
import { useContext, useState } from 'react'
import { formatWad, fromWad } from 'utils/format/formatNumber'
import { tokenSymbolText } from 'utils/tokenSymbolText'

export function LegacyProjectTokensDescription() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { tokenSymbol } = useContext(V2V3ProjectContext)

  const [migrateTokensModalVisible, setMigrateTokensModalVisible] =
    useState<boolean>(false)

  const legacyTokenBalance = useTotalLegacyTokenBalance({ projectId })

  const tokenText = tokenSymbolText({
    tokenSymbol,
    capitalize: false,
    plural: true,
  })

  return (
    <>
      <span>
        {formatWad(legacyTokenBalance, { precision: 0 }) ?? 0} {tokenText}
      </span>

      {legacyTokenBalance?.gt(0) && (
        <Button size="small" onClick={() => setMigrateTokensModalVisible(true)}>
          <Trans>Migrate tokens</Trans>
        </Button>
      )}
      {legacyTokenBalance && (
        <MigrateProjectTokensModal
          legacyTokenBalance={parseInt(fromWad(legacyTokenBalance))}
          open={migrateTokensModalVisible}
          onCancel={() => setMigrateTokensModalVisible(false)}
        />
      )}
    </>
  )
}
