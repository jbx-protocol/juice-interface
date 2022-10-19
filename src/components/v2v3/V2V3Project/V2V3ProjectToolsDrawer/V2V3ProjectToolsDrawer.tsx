import { Trans } from '@lingui/macro'
import { Divider, Drawer, Space } from 'antd'
import { AddToProjectBalanceForm } from 'components/Project/ProjectToolsDrawer/AddToProjectBalanceForm'
import { ExportSection } from 'components/Project/ProjectToolsDrawer/ExportSection'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/splits'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import useMobile from 'hooks/Mobile'
import { useAddToBalanceTx } from 'hooks/v2v3/transactor/AddToBalanceTx'
import { useDeployProjectPayerTx } from 'hooks/v2v3/transactor/DeployProjectPayerTx'
import { ETHPayoutSplitGroup, ReservedTokensSplitGroup } from 'models/splits'
import { useContext } from 'react'
import { ExportSplitsButton } from './ExportSplitsButton'
import { PaymentAddressSection } from './PaymentAddressSection'

export function V2V3ProjectToolsDrawer({
  open,
  onClose,
}: {
  open?: boolean
  onClose?: VoidFunction
}) {
  const { payoutSplits, reservedTokensSplits } = useContext(V2V3ProjectContext)

  const isMobile = useMobile()

  return (
    <Drawer
      open={open}
      onClose={onClose}
      width={!isMobile ? 600 : undefined}
      drawerStyle={{ paddingBottom: '2rem' }}
    >
      <h1>
        <Trans>Tools</Trans>
      </h1>

      <Space direction="vertical" size="middle" style={{ width: '100%' }}>
        <section>
          <h3>
            <Trans>Create Payment Address</Trans>
          </h3>

          <PaymentAddressSection
            useDeployProjectPayerTx={useDeployProjectPayerTx}
          />
        </section>

        <Divider />

        <section>
          <AddToProjectBalanceForm useAddToBalanceTx={useAddToBalanceTx} />
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
                <Trans>Export token allocation CSV</Trans>
              </ExportSplitsButton>
            ) : undefined
          }
        />
      </Space>
    </Drawer>
  )
}
