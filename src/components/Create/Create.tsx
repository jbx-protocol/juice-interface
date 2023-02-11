import { t, Trans } from '@lingui/macro'
import { Callout } from 'components/Callout'
import { DeployButtonText } from 'components/buttons/DeployProjectButtonText'
import ExternalLink from 'components/ExternalLink'
import Loading from 'components/Loading'
import { useRouter } from 'next/router'
import { helpPagePath } from 'utils/routes'
import {
  FundingCyclesPage,
  FundingTargetPage,
  NftRewardsPage,
  PayoutsPage,
  ProjectDetailsPage,
  ProjectTokenPage,
  ReconfigurationRulesPage,
  ReviewDeployPage,
} from './components'
import { CreateBadge } from './components/CreateBadge'
import { DeploySuccess } from './components/pages/ReviewDeploy/components/DeploySuccess'
import { PayoutsMigrationModal } from './components/PayoutsMigrationModal'
import { RecallCard } from './components/RecallCard'
import { Wizard } from './components/Wizard'
import { useLoadingInitialStateFromQuery } from './hooks/LoadInitialStateFromQuery'

export function Create() {
  const router = useRouter()
  const deployedProjectId = router.query.deployedProjectId as string
  if (deployedProjectId) {
    const projectId = parseInt(deployedProjectId)
    return <DeploySuccess projectId={projectId} />
  }

  const isMigration = router.query.migration === 'true'

  const initialStateLoading = useLoadingInitialStateFromQuery()

  if (initialStateLoading) return <Loading />

  return (
    <>
      <h1 className="text-center text-base font-medium uppercase text-black dark:text-slate-100">
        {!isMigration ? (
          <Trans>Create a project</Trans>
        ) : (
          <Trans>Re-launch a project</Trans>
        )}
      </h1>
      {/* TODO: Remove wizard-create once form item css override is replaced */}
      <div className="wizard-create">
        <Wizard className="pb-28" doneText={<DeployButtonText />}>
          {isMigration && (
            <Callout.Info className="w-full md:w-[800px]">
              <strong>
                <Trans>Re-launch on V3</Trans>
              </strong>
              <p>
                <Trans>
                  We recommend you visit the{' '}
                  <ExternalLink href="https://discord.gg/6jXrJSyDFf">
                    Juicebox Discord
                  </ExternalLink>{' '}
                  for help and advice on this process.
                </Trans>
              </p>
            </Callout.Info>
          )}
          <Wizard.Page
            name="projectDetails"
            title={t`Project Details`}
            description={t`Enter your project's details. You can edit your project's details at any time after you deploy your project, but the transaction will cost gas.`}
          >
            <ProjectDetailsPage />
          </Wizard.Page>
          <Wizard.Page
            name="fundingCycles"
            title={t`Funding Cycles`}
            description={
              <Trans>
                Juicebox projects are funded in cycles. A Funding Cycle is a set
                period of time in which your project settings are locked.{' '}
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
          <Wizard.Page
            name="fundingTarget"
            title={t`Funding Target`}
            description={
              <div className="flex flex-col gap-4">
                <Trans>
                  Select the option that best suits your project’s funding
                  requirements.
                </Trans>
                <RecallCard show={['fundingCycles']} />
              </div>
            }
          >
            <FundingTargetPage />
          </Wizard.Page>
          <Wizard.Page
            name="payouts"
            title={t`Payouts`}
            description={
              <div className="flex flex-col gap-4">
                <Trans>
                  Choose which addresses to pay and how to split the total
                  payout amount each funding cycle.
                </Trans>
                <RecallCard show={['fundingCycles', 'fundingTarget']} />
              </div>
            }
          >
            <PayoutsPage />
          </Wizard.Page>
          <Wizard.Page
            name="projectToken"
            title={t`Project Token`}
            description={
              <Trans>
                Design how your project's tokens should work. You can use your
                project tokens for governance, ownership & treasury redemptions.{' '}
                <ExternalLink href="https://info.juicebox.money/dev/learn/glossary/tokens">
                  Learn more
                </ExternalLink>
                .
              </Trans>
            }
          >
            <ProjectTokenPage />
          </Wizard.Page>
          <Wizard.Page
            name="nftRewards"
            title={
              <div className="inline-flex items-center gap-2">
                <Trans>NFTs</Trans>
                <div>
                  <CreateBadge.Optional />
                </div>
              </div>
            }
            description={
              <Trans>
                Reward contributors with NFTs when they meet your funding
                criteria.
              </Trans>
            }
          >
            <NftRewardsPage />
          </Wizard.Page>
          <Wizard.Page
            name="reconfigurationRules"
            title={<Trans>Reconfiguration Rules</Trans>}
            description={
              <Trans>
                Setting a reconfiguration delay means changes to your funding
                cycle settings only take effect after the delay period has
                passed. This helps build trust with your contributors.
              </Trans>
            }
          >
            <ReconfigurationRulesPage />
          </Wizard.Page>
          <Wizard.Page
            className="max-w-full md:max-w-[800px]"
            name="reviewDeploy"
            title={t`Review & Deploy`}
            description={
              <Trans>
                Review your project data below. Once launched, your first
                funding cycle can't be changed. You can reconfigure upcoming
                funding cycles according to your project's reconfiguration
                rules.
              </Trans>
            }
          >
            <ReviewDeployPage />
          </Wizard.Page>
        </Wizard>
      </div>
      <PayoutsMigrationModal />
    </>
  )
}
