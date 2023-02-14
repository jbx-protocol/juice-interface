import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { InfoCallout } from 'components/Callout/InfoCallout'
import EtherscanLink from 'components/EtherscanLink'

/**
 * Component to call `migrateController` on a project.
 */
export function MigrateProjectController({
  controllerAddress,
}: {
  controllerAddress: string
}) {
  function executeSetControllerTx() {
    // TODO set controller
  }

  return (
    <div>
      <InfoCallout className="mb-5">
        <Trans>
          This transaction will set your project's Controller contract to:{' '}
          <EtherscanLink type="address" value={controllerAddress}>
            {controllerAddress}
          </EtherscanLink>
        </Trans>
      </InfoCallout>
      <Button onClick={() => executeSetControllerTx()} type="primary">
        Upgrade Controller
      </Button>
    </div>
  )
}
