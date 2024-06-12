import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { BigNumber } from 'ethers'
import { V1UserProvider } from 'packages/v1/contexts/User/V1UserProvider'
import { MigrateLegacyProjectTokensModal } from 'packages/v2v3/components/V2V3Project/V2V3ManageTokensSection/LegacyProjectTokensDescription/MigrateLegacyProjectTokensModal/MigrateLegacyProjectTokensModal'
import { useState } from 'react'

export function MigrateTokensButton({
  totalLegacyTokenBalance,
  v1ClaimedBalance,
  className,
}: {
  totalLegacyTokenBalance: BigNumber
  v1ClaimedBalance: BigNumber
  className?: string
}) {
  const [modalOpen, setModalOpen] = useState<boolean>(false)

  return (
    <>
      <Button
        size="small"
        onClick={() => setModalOpen(true)}
        className={className}
      >
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
  )
}
