import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { TokenAmount } from 'components/TokenAmount'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1UserProvider } from 'contexts/v1/User/V1UserProvider'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import { useTotalLegacyTokenBalance } from 'hooks/JBV3Token/contractReader/useTotalLegacyTokenBalance'
import { useContext, useState } from 'react'
import { MigrateLegacyProjectTokensModal } from './MigrateLegacyProjectTokensModal'

export function LegacyProjectTokensDescription() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { tokenSymbol } = useContext(V2V3ProjectContext)

  const [modalOpen, setModalOpen] = useState<boolean>(false)

  const { totalLegacyTokenBalance, v1ClaimedBalance } =
    useTotalLegacyTokenBalance({ projectId })

  return (
    <>
      <span>
        <TokenAmount
          amountWad={totalLegacyTokenBalance}
          tokenSymbol={tokenSymbol}
        />
      </span>

      {totalLegacyTokenBalance?.gt(0) && (
        <>
          <Button size="small" onClick={() => setModalOpen(true)}>
            <Trans>Migrate tokens</Trans>
          </Button>
          {modalOpen && (
            <V1UserProvider>
              <MigrateLegacyProjectTokensModal
                open={modalOpen}
                legacyTokenBalance={totalLegacyTokenBalance}
                v1ClaimedBalance={v1ClaimedBalance}
                onCancel={() => setModalOpen(false)}
              />
            </V1UserProvider>
          )}
        </>
      )}
    </>
  )
}
