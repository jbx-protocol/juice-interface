import { t, Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { useWallet } from 'hooks/Wallet'
import { TransactionProvider } from 'providers/TransactionProvider'
import { V2ContractsProvider } from 'providers/v2/V2ContractsProvider'
import { V2CurrencyProvider } from 'providers/v2/V2CurrencyProvider'
import { helpPagePath } from 'utils/routes'
import { FundingCyclesPage, ProjectDetailsPage } from './components'
import { Wizard } from './components/Wizard'

export function Create() {
  const { chain } = useWallet()
  return (
    <V2ContractsProvider>
      <TransactionProvider>
        <V2CurrencyProvider>
          <Wizard
            doneText={
              // TODO: Handle wallet connect event and text changes
              chain?.name
                ? t`Deploy project to ${chain?.name}`
                : t`Deploy project`
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
                  Juicebox projects are funded in cycles. A Funding Cycle is a
                  set period of time in which your project settings are locked.{' '}
                  <ExternalLink
                    href={helpPagePath('/dev/learn/glossary/funding-cycle')}
                  >
                    Learn more.
                  </ExternalLink>
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
        </V2CurrencyProvider>
      </TransactionProvider>
    </V2ContractsProvider>
  )
}
