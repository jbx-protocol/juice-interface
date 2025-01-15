import { Trans, t } from '@lingui/macro'
import { DEADLINE_EXPLANATION, RULESET_EXPLANATION } from 'components/strings'

import { Badge } from 'components/Badge'
import Loading from 'components/Loading'
import { readNetwork } from 'constants/networks'
import { NetworkName } from 'models/networkName'
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
import { Wizard } from './components/Wizard/Wizard'
import { DeployProjectButtonText } from './DeployProjectButtonText'
import { useLoadingInitialStateFromQuery } from './hooks/useLoadInitialStateFromQuery'

export function Create() {
  const router = useRouter()
  const deployedProjectId = router.query.deployedProjectId as string
  const initialStateLoading = useLoadingInitialStateFromQuery()

  if (initialStateLoading) return <Loading />

  if (deployedProjectId) {
    const projectId = parseInt(deployedProjectId)
    return <DeploySuccess projectId={projectId} />
  }

  return (
    <div className="mt-12 md:mt-10">
      <h1 className="mb-0 text-center font-heading text-base font-medium uppercase text-black dark:text-slate-100">
        <span className="inline-flex gap-2">
          <Trans>Create a project</Trans>
          <Badge variant="info">Beta</Badge>
        </span>
      </h1>
      {/* TODO: Remove wizard-create once form item css override is replaced */}
      <div className="wizard-create">
        <Wizard className="pb-28" doneText={<DeployProjectButtonText />}>
          <Wizard.Page
            name="projectDetails"
            title={t`Project Details`}
            description={t`Enter your project's details. You can edit your project's details at any time after you deploy your project, but the transaction will cost gas.`}
          >
            <ProjectDetailsPage />
          </Wizard.Page>
          <Wizard.Page
            name="fundingCycles"
            title={t`Ruleset`}
            description={RULESET_EXPLANATION}
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
                token redemptions, or for use in future rulesets. Payouts reset
                each ruleset.
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
                holders can cash out their tokens to reclaim some ETH from your
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
            description={DEADLINE_EXPLANATION}
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
    </div>
  )
}
