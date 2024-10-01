import { Trans } from '@lingui/macro'
import { Divider, Drawer } from 'antd'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/splits'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import useMobile from 'hooks/useMobile'
import Link from 'next/link'
import { AddToProjectBalanceForm } from 'packages/v2v3/components/V2V3Project/V2V3ProjectToolsDrawer/AddToProjectBalanceForm'
import { ExportSection } from 'packages/v2v3/components/V2V3Project/V2V3ProjectToolsDrawer/ExportSection'
import { V2V3ProjectContext } from 'packages/v2v3/contexts/Project/V2V3ProjectContext'
import { useAddToBalanceTx } from 'packages/v2v3/hooks/transactor/AddToBalanceTx'
import { useDeployProjectPayerTx } from 'packages/v2v3/hooks/transactor/useDeployProjectPayerTx'
import { ETHPayoutSplitGroup, ReservedTokensSplitGroup } from 'packages/v2v3/models/splits'
import { v2v3ProjectRoute } from 'packages/v2v3/utils/routes'
import { useContext } from 'react'
import { ExportSplitsButton } from './ExportSplitsButton'
import { PaymentAddressSection } from './PaymentAddressSection/PaymentAddressSection'

export function V2V3ProjectToolsDrawer({
  open,
  onClose,
}: {
  open?: boolean
  onClose?: VoidFunction
}) {
  const { projectId, projectMetadata } = useContext(ProjectMetadataContext)
  const { payoutSplits, reservedTokensSplits, handle } =
    useContext(V2V3ProjectContext)

  const hasOFAC = projectMetadata?.projectRequiredOFACCheck

  const isMobile = useMobile()

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={!isMobile ? 600 : undefined}
      drawerStyle={{ paddingBottom: '2rem' }}
    >
      <h1 className="text-primary text-2xl">
        <Trans>Tools</Trans>
      </h1>

      <div className="flex flex-col gap-4">
        {hasOFAC ? null : (
          <>
            <section>
              <AddToProjectBalanceForm useAddToBalanceTx={useAddToBalanceTx} />
            </section>

            <Divider />
            <section>
              <h3 className="text-primary">
                <Trans>Project payer addresses</Trans>
              </h3>

              <PaymentAddressSection
                useDeployProjectPayerTx={useDeployProjectPayerTx}
              />
            </section>
            <Divider />
          </>
        )}

        <ExportSection
          exportPayoutsButton={
            payoutSplits ? (
              <ExportSplitsButton<ETHPayoutSplitGroup>
                groupedSplits={{
                  splits: payoutSplits,
                  group: ETH_PAYOUT_SPLIT_GROUP,
                }}
              >
                <Trans>Export payouts CSV</Trans>
              </ExportSplitsButton>
            ) : undefined
          }
          exportReservedTokensButton={
            reservedTokensSplits ? (
              <ExportSplitsButton<ReservedTokensSplitGroup>
                groupedSplits={{
                  splits: reservedTokensSplits,
                  group: RESERVED_TOKEN_SPLIT_GROUP,
                }}
              >
                <Trans>Export reserved token recipient CSV</Trans>
              </ExportSplitsButton>
            ) : undefined
          }
        />

        <Divider />

        <section>
          <h3 className="text-primary">
            <Trans>Project contracts directory</Trans>
          </h3>

          <p>
            Browse the project's smart contract addresses.{' '}
            <Link href={`${v2v3ProjectRoute({ projectId, handle })}/contracts`}>
              Go to contracts directory
            </Link>
            .
          </p>
        </section>
      </div>
    </Drawer>
  )
}
