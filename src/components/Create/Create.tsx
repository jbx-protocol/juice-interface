import { t, Trans } from '@lingui/macro'
import { useWallet } from 'hooks/Wallet'
import { FundingCyclesPage, ProjectDetailsPage } from './components'
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
      <Wizard.Page
        name="fundingCycles"
        title={t`Funding Cycles`}
        description={
          <Trans>
            Juicebox projects are funded in cycles. You can think of this as a
            set period of time in which your project settings are locked.{' '}
            <a href="#TODO">Learn more.</a>
          </Trans>
        }
      >
        <FundingCyclesPage />
      </Wizard.Page>
      <Wizard.Page name="nextStep" title={t`Empty Step`}>
        <div>TODO</div>
        <Wizard.Page.ButtonControl />
      </Wizard.Page>
    </Wizard>
  )
}
