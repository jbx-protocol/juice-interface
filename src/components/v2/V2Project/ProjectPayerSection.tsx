import { Trans } from '@lingui/macro'
import { Button, Divider } from 'antd'
import { TransactorInstance } from 'hooks/Transactor'
import { useState } from 'react'
import { TransactionReceipt } from '@ethersproject/providers'
import FormattedAddress from 'components/shared/FormattedAddress'
import { JBDiscordLink } from 'components/Landing/QAs'

import { readProvider } from 'constants/readProvider'

const DEPLOY_EVENT_IDX = 0

/**
 * Return the address of the project payer created from a `deployProjectPayer` transaction.
 * @param txReceipt receipt of `deployProjectPayer` transaction
 */
const getProjectPayerAddressFromReceipt = (
  txReceipt: TransactionReceipt,
): string => {
  const newProjectPayerAddress = txReceipt?.logs[DEPLOY_EVENT_IDX]?.address
  return newProjectPayerAddress
}

export default function ProjectPayerSection({
  useDeployProjectPayerTx,
}: {
  useDeployProjectPayerTx: () => TransactorInstance<{}> | undefined
}) {
  const [loadingProjectPayer, setLoadingProjectPayer] = useState<boolean>()
  const [projectPayerAddress, setProjectPayerAddress] = useState<string>()
  // TODO: load project payer and show different thing in this section if the project already has one
  // (Issue: #897)

  const deployProjectPayerTx = useDeployProjectPayerTx()

  function deployProjectPayer() {
    setLoadingProjectPayer(true)
    if (deployProjectPayerTx) {
      deployProjectPayerTx(
        {
          args: [],
        },
        {
          async onConfirmed(result) {
            const txHash = result?.transaction?.hash
            if (!txHash) {
              return
            }

            const txReceipt = await readProvider.getTransactionReceipt(txHash)
            const newProjectPayerAddress =
              getProjectPayerAddressFromReceipt(txReceipt)
            if (newProjectPayerAddress === undefined) {
              return
            }
            setProjectPayerAddress(newProjectPayerAddress)
            setLoadingProjectPayer(false)
          },
        },
      )
    }
  }

  return (
    <section>
      <h3>
        <Trans>Create payable address</Trans>
      </h3>
      <p>
        <Trans>
          This will give you an ETH address people can use to pay this project
          rather than paying through the juicebox.money interface.
        </Trans>
      </p>
      <p>
        <Trans>
          The tokens minted as a result of payments to this address will belong
          to the payer, the same way as if they were to pay through the
          interface. <strong>However</strong>, if someone pays the project from
          a non-custodial entity such as the Coinbase app, the tokens cannot be
          issued to their personal wallets and will be lost.
        </Trans>
      </p>
      <p>
        <Trans>
          This launches a new contract so will incur significant gas fees.
        </Trans>
      </p>
      {!projectPayerAddress ? (
        <>
          <Button
            onClick={deployProjectPayer}
            loading={loadingProjectPayer}
            size="small"
            type="primary"
          >
            <span>
              <Trans>Deploy project payer contract</Trans>
            </span>
          </Button>
          <p style={{ fontSize: 11, marginTop: 10 }}>
            <Trans>
              If you have already deployed a payable address and have lost it,
              please contact the Juicebox team through{' '}
              <JBDiscordLink>Discord.</JBDiscordLink>
            </Trans>
          </p>
        </>
      ) : (
        <>
          <h4>
            <Trans>Your new payable address:</Trans>
          </h4>
          <FormattedAddress
            address={projectPayerAddress}
            label={projectPayerAddress}
          />
          <p>
            <Trans>
              <strong>Note:</strong> Copy this address and save it now.
            </Trans>
          </p>
          <p>
            <Trans>
              We are currently still working on a way to load this address
              through our interface. If you lose your address please contact the
              Juicebox team through <JBDiscordLink>Discord</JBDiscordLink>.
            </Trans>
          </p>
        </>
      )}
      <Divider />
    </section>
  )
}
