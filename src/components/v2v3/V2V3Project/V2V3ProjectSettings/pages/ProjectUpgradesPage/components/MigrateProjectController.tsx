import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import { InfoCallout } from 'components/Callout/InfoCallout'
import EtherscanLink from 'components/EtherscanLink'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V2V3ContractsContext } from 'contexts/v2v3/Contracts/V2V3ContractsContext'
import { TransactorInstance } from 'hooks/Transactor'
import { useMigrateControllerTx } from 'hooks/v2v3/transactor/MigrateControllerTx'
import { useContext, useState } from 'react'

function useTransactionExecutor<T>(
  tx: TransactorInstance<T>,
  {
    onConfirmed,
    onError,
  }: { onConfirmed?: VoidFunction; onError?: ErrorCallback } = {},
) {
  const [loading, setLoading] = useState<boolean>(false)

  const execute = async function (args: T) {
    setLoading(true)
    const res = await tx(args, {
      onConfirmed() {
        setLoading(false)
        return onConfirmed?.()
      },
      onError(e) {
        setLoading(false)
        console.error(e)
        onError?.(e)
      },
    })

    if (!res) {
      setLoading(false)
      onError?.(new Error('Transaction failed'))
    }
  }

  return { loading, execute }
}

/**
 * Component to call `migrateController` on a project.
 */
export function MigrateProjectController({
  controllerAddress,
}: {
  controllerAddress: string
}) {
  const { execute, loading } = useTransactionExecutor(useMigrateControllerTx())
  const { projectId } = useContext(ProjectMetadataContext)
  const { contracts } = useContext(V2V3ContractsContext)

  function onClick() {
    execute({
      projectId,
      newControllerAddress: contracts?.JBController3_0_1.address,
    })
  }

  return (
    <div>
      <InfoCallout className="mb-5">
        <Trans>
          This transaction will set your project's Controller contract to:{' '}
          <EtherscanLink type="address" value={controllerAddress}>
            {controllerAddress}
          </EtherscanLink>
          . Any reserved tokens will be distributed.
        </Trans>
      </InfoCallout>
      <Button onClick={onClick} type="primary" loading={loading}>
        Upgrade Controller
      </Button>
    </div>
  )
}
