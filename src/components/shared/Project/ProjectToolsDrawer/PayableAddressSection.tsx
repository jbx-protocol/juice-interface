import { Trans } from '@lingui/macro'
import { JBDiscordLink } from 'components/Landing/QAs'
import LaunchProjectPayerButton from 'components/v2/V2Project/LaunchProjectPayer/LaunchProjectPayerButton'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { ExclamationCircleOutlined } from '@ant-design/icons'
import { DeployProjectPayerTxArgs } from 'hooks/v2/transactor/DeployProjectPayerTx'
import { TransactorInstance } from 'hooks/Transactor'

export function PayableAddressSection({
  useDeployProjectPayerTx,
}: {
  useDeployProjectPayerTx: () =>
    | TransactorInstance<DeployProjectPayerTxArgs>
    | undefined
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  return (
    <section>
      <h3>
        <Trans>Create payable address</Trans>
      </h3>
      <p>
        <Trans>
          Create an Ethereum address that can be used to pay your project
          directly.
        </Trans>
      </p>
      <LaunchProjectPayerButton
        useDeployProjectPayerTx={useDeployProjectPayerTx}
      />
      <p style={{ marginTop: 10, color: colors.text.secondary }}>
        <ExclamationCircleOutlined />{' '}
        <Trans>
          If you have already deployed a payable address and have lost it,
          please contact the Juicebox team through{' '}
          <JBDiscordLink>Discord.</JBDiscordLink>
        </Trans>
      </p>
    </section>
  )
}
