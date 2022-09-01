import { PaymentAddressSection } from 'components/Project/ProjectToolsDrawer/PaymentAddressSection'
import { useDeployProjectPayerTx } from 'hooks/v2/transactor/DeployProjectPayerTx'

export function V2PaymentAddressSettingsPage() {
  return (
    <PaymentAddressSection useDeployProjectPayerTx={useDeployProjectPayerTx} />
  )
}
