import { plural } from '@lingui/macro'
import { Button } from 'antd'
import { PROJECT_PAYER_ADDRESS_EXPLANATION } from 'components/strings'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { useEtherc20ProjectPayersQuery } from 'generated/graphql'
import { TransactorInstance } from 'hooks/useTransactor'
import { client } from 'lib/apollo/client'
import { LaunchProjectPayerButton } from 'packages/v2v3/components/V2V3Project/V2V3ProjectToolsDrawer/PaymentAddressSection/LaunchProjectPayerButton'
import { PaymentAddressesModal } from 'packages/v2v3/components/V2V3Project/modals/PaymentAddressesModal'
import { DeployProjectPayerTxArgs } from 'packages/v2v3/hooks/transactor/useDeployProjectPayerTx'
import { useContext, useState } from 'react'

export function PaymentAddressSection({
  useDeployProjectPayerTx,
}: {
  useDeployProjectPayerTx: () =>
    | TransactorInstance<DeployProjectPayerTxArgs>
    | undefined
}) {
  const { projectId } = useContext(ProjectMetadataContext)

  const [projectPayersModalIsVisible, setProjectPayersModalIsVisible] =
    useState<boolean>()

  const { data, loading } = useEtherc20ProjectPayersQuery({
    client,
    variables: {
      where: {
        projectId,
      },
    },
  })

  const projectPayers = data?.etherc20ProjectPayers

  return (
    <>
      <p>{PROJECT_PAYER_ADDRESS_EXPLANATION}</p>

      <p>
        <Button
          onClick={() => setProjectPayersModalIsVisible(true)}
          size="small"
          type="link"
          className="p-0"
          loading={loading}
          disabled={!projectPayers || projectPayers.length === 0}
        >
          {plural(projectPayers?.length ?? 0, {
            one: 'View deployed project payer address',
            other: 'View deployed project payer addresses',
          })}
        </Button>
        <PaymentAddressesModal
          open={projectPayersModalIsVisible}
          onCancel={() => setProjectPayersModalIsVisible(false)}
          projectPayers={projectPayers}
        />
      </p>

      <LaunchProjectPayerButton
        useDeployProjectPayerTx={useDeployProjectPayerTx}
      />
    </>
  )
}
