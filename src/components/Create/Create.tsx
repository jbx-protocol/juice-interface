import { t, Trans } from '@lingui/macro'
import { DeployButtonText } from 'components/buttons/DeployProjectButtonText'
import { Callout } from 'components/Callout/Callout'
import ExternalLink from 'components/ExternalLink'
import Loading from 'components/Loading'
import {
  CYCLE_EXPLANATION,
  RECONFIG_RULES_EXPLANATION,
} from 'components/strings'
import { readNetwork } from 'constants/networks'
import { NetworkName } from 'models/networkName'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { CreateBadge } from './components/CreateBadge'
import { FundingCyclesPage } from './components/pages/FundingCycles/FundingCyclesPage'
import { NftRewardsPage } from './components/pages/NftRewards/NftRewardsPage'
import { PayoutsPage } from './components/pages/PayoutsPage/PayoutsPage'
import { ProjectDetailsPage } from './components/pages/ProjectDetails/ProjectDetailsPage'
import { ProjectTokenPage } from './components/pages/ProjectToken/ProjectTokenPage'
import { ReconfigurationRulesPage } from './components/pages/ReconfigurationRules/ReconfigurationRulesPage'
import { DeploySuccess } from './components/pages/ReviewDeploy/components/DeploySuccess'
import { ReviewDeployPage } from './components/pages/ReviewDeploy/ReviewDeployPage'
import { PayoutsMigrationModal } from './components/PayoutsMigrationModal'
import { Wizard } from './components/Wizard/Wizard'
import { useLoadingInitialStateFromQuery } from './hooks/useLoadInitialStateFromQuery'

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
    <div className="mt-12 md:mt-10">
      <h1 className="mb-0 text-center font-heading text-base font-medium uppercase text-black dark:text-slate-100">
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
            <Callout.Info className="md:w-3xl w-full">
              <strong>
                <Trans>Re-launch on V3</Trans>
              </strong>
              <p>
                <Trans>
                  We recommend you <Link href="/contact">contact us</Link> or
                  visit the{' '}
                  <ExternalLink href="https://discord.gg/6jXrJSyDFf">
                    Juicebox Discord
                  </ExternalLink>{' '}
                  for help with this process.
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
            title={t`Cycles`}
            description={CYCLE_EXPLANATION}
          >
            <FundingCyclesPage />
          </Wizard.Page>
          <Wizard.Page
            name="payouts"
            title={t`Payouts`}
            description={
              <Trans>
                Pay out ETH from your project to any Ethereum wallet or Juicebox
                project. ETH which <em>isn't</em> paid out will be available for
                token redemptions, or for use in future cycles. Payouts reset
                each cycle.
              </Trans>
            }
          >
            <PayoutsPage />
          </Wizard.Page>
          <Wizard.Page
            name="projectToken"
            title={t`Token`}
            description={
              <Trans>
                When people pay your project, they receive its tokens. Project
                tokens can be used for governance or community access, and token
                holders can redeem their tokens to reclaim some ETH from your
                project. You can also reserve some tokens for recipients of your
                choosing.
              </Trans>
            }
          >
            <ProjectTokenPage />
          </Wizard.Page>
          <Wizard.Page
            name="nftRewards"
            title={
              <div className="flex items-center gap-3">
                <Trans>NFTs</Trans>
                <CreateBadge.Optional />
              </div>
            }
            description={
              <Trans>Reward your supporters with custom NFTs.</Trans>
            }
          >
            <NftRewardsPage />
          </Wizard.Page>
          <Wizard.Page
            name="reconfigurationRules"
            title={<Trans>Edit Deadline</Trans>}
            description={RECONFIG_RULES_EXPLANATION}
          >
            <ReconfigurationRulesPage />
          </Wizard.Page>
          <Wizard.Page
            className="max-w-full md:w-full md:max-w-3xl"
            name="reviewDeploy"
            title={t`Review & Deploy`}
            description={
              <Trans>
                Review your project and deploy it to{' '}
                {readNetwork.name ?? NetworkName.mainnet}.
              </Trans>
            }
          >
            <ReviewDeployPage />
          </Wizard.Page>
        </Wizard>
      </div>
      <PayoutsMigrationModal />
    </div>
  )
}
