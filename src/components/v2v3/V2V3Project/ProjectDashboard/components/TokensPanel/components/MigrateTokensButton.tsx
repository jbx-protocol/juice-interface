import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { MigrateLegacyProjectTokensModal } from 'components/v2v3/V2V3Project/V2V3ManageTokensSection/LegacyProjectTokensDescription/MigrateLegacyProjectTokensModal/MigrateLegacyProjectTokensModal'
import { V1UserProvider } from 'contexts/v1/User/V1UserProvider'
import { BigNumber } from 'ethers'
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
