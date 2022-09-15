import { t } from '@lingui/macro'
import { useWallet } from 'hooks/Wallet'
import { ProjectDetailsPage } from './components'
import { Wizard } from './components/Wizard'

export function Create() {
  const { chain } = useWallet()
  return (
    <Wizard
      doneText={
        // TODO: Handle wallet connect event and text changes
        chain?.name ? t`Deploy project to ${chain?.name}` : t`Deploy project`
      }
    >
      <Wizard.Page
        name="projectDetails"
        title={t`Project Details`}
        description={t`Enter your project’s details. You can edit your project's details at any time after you deploy project your project, but the transaction will cost gas.`}
      >
        <ProjectDetailsPage />
      </Wizard.Page>
    </Wizard>
  )
}
