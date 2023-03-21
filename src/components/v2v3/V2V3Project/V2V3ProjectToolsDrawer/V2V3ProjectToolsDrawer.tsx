import { Trans } from '@lingui/macro'
import { Divider, Drawer, Space } from 'antd'
import { AddToProjectBalanceForm } from 'components/Project/ProjectToolsDrawer/AddToProjectBalanceForm'
import { ExportSection } from 'components/Project/ProjectToolsDrawer/ExportSection'
import { HeldFeesSection } from 'components/Project/ProjectToolsDrawer/HeldFeesSection'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/splits'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/Project/V2V3ProjectContext'
import useMobile from 'hooks/Mobile'
import { useAddToBalanceTx } from 'hooks/v2v3/transactor/AddToBalanceTx'
import { useDeployProjectPayerTx } from 'hooks/v2v3/transactor/DeployProjectPayerTx'
import { ETHPayoutSplitGroup, ReservedTokensSplitGroup } from 'models/splits'
import Link from 'next/link'
import { useContext } from 'react'
import { v2v3ProjectRoute } from 'utils/routes'
import { ExportSplitsButton } from './ExportSplitsButton'
import { PaymentAddressSection } from './PaymentAddressSection'
import { SplitsPayerSection } from './SplitsPayerSection'

export function V2V3ProjectToolsDrawer({
  open,
  onClose,
}: {
  open?: boolean
  onClose?: VoidFunction
}) {
  const { projectId } = useContext(ProjectMetadataContext)
  const { payoutSplits, reservedTokensSplits, handle } =
    useContext(V2V3ProjectContext)

  const isMobile = useMobile()

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={!isMobile ? 600 : undefined}
      drawerStyle={{ paddingBottom: '2rem' }}
    >
      <h1 className="text-primary">
        <Trans>Tools</Trans>
      </h1>

      <Space direction="vertical" size="middle" className="w-full">
        <section>
          <h3 className="text-primary">
            <Trans>Create a project payer address</Trans>
          </h3>

          <PaymentAddressSection
            useDeployProjectPayerTx={useDeployProjectPayerTx}
          />
        </section>

        <Divider />

        <section>
          <Space direction="vertical" size="middle">
            <AddToProjectBalanceForm useAddToBalanceTx={useAddToBalanceTx} />
            <HeldFeesSection />
          </Space>
        </section>

        <Divider />

        <section>
          <h3 className="text-primary">
            <Trans>Create a splits payer address</Trans>
          </h3>

          <SplitsPayerSection />
        </section>

        <Divider />

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
              <a>Go to contracts directory</a>
            </Link>
            .
          </p>
        </section>
      </Space>
    </Drawer>
  )
}
