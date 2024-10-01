import { Trans } from '@lingui/macro'
import { Divider, Drawer } from 'antd'
import useMobile from 'hooks/useMobile'
import { AddToProjectBalanceForm } from './AddToProjectBalanceForm'

export function V4ProjectToolsDrawer({
  open,
  onClose,
}: {
  open?: boolean
  onClose?: VoidFunction
}) {
  // const hasOFAC = projectMetadata?.projectRequiredOFACCheck

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
        {/* {hasOFAC ? null : ( */}
        <>
          <section>
            <AddToProjectBalanceForm />
          </section>

          <Divider />
          {/* @v4todo: <section>
            <h3 className="text-primary">
              <Trans>Project payer addresses</Trans>
            </h3>

            <PaymentAddressSection />
          </section>
          <Divider /> */}
        </>
        {/* )} */}

        {/* <ExportSection
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
        /> */}

        {/* <Divider />

        <section>
          <h3 className="text-primary">
            <Trans>Project contracts directory</Trans>
          </h3>

          <p>
            Browse the project's smart contract addresses.{' '}
            <Link href={`${v4ProjectRoute({ projectId, handle })}/contracts`}>
              Go to contracts directory
            </Link>
            .
          </p>
        </section> */}
      </div>
    </Drawer>
  )
}
