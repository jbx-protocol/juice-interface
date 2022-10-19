import { Trans } from '@lingui/macro'
import { Divider, Drawer, Space, Tabs } from 'antd'
import { AddToProjectBalanceForm } from 'components/Project/ProjectToolsDrawer/AddToProjectBalanceForm'
import { ExportSection } from 'components/Project/ProjectToolsDrawer/ExportSection'
import {
  ETH_PAYOUT_SPLIT_GROUP,
  RESERVED_TOKEN_SPLIT_GROUP,
} from 'constants/splits'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2V3ProjectContext } from 'contexts/v2v3/V2V3ProjectContext'
import { useIsUserAddress } from 'hooks/IsUserAddress'
import useMobile from 'hooks/Mobile'
import { useAddToBalanceTx } from 'hooks/v2v3/transactor/AddToBalanceTx'
import { useDeployProjectPayerTx } from 'hooks/v2v3/transactor/DeployProjectPayerTx'
import { ETHPayoutSplitGroup, ReservedTokensSplitGroup } from 'models/splits'
import Link from 'next/link'
import { useContext } from 'react'
import { settingsPagePath } from 'utils/routes'
import { ExportSplitsButton } from './ExportSplitsButton'
import { PaymentAddressSection } from './PaymentAddressSection'

const { TabPane } = Tabs

export function V2V3ProjectToolsDrawer({
  open,
  onClose,
}: {
  open?: boolean
  onClose?: VoidFunction
}) {
  const { projectOwnerAddress, payoutSplits, reservedTokensSplits, handle } =
    useContext(V2V3ProjectContext)
  const { projectId } = useContext(ProjectMetadataContext)

  const isMobile = useMobile()
  const isOwnerWallet = useIsUserAddress(projectOwnerAddress)

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

      <Tabs>
        <TabPane tab={<Trans>General</Trans>} key="1">
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
        </TabPane>
        {isOwnerWallet && (
          <TabPane tab={<Trans>Owner tools</Trans>} key="2">
            Owner tools have moved.{' '}
            <Link href={settingsPagePath('general', { projectId, handle })}>
              <a onClick={() => onClose?.()}>Go to project settings.</a>
            </Link>
          </TabPane>
        )}
      </Tabs>
    </Drawer>
  )
}
