import { Trans, t } from '@lingui/macro'
import { DEADLINE_EXPLANATION, RULESET_EXPLANATION } from 'components/strings'

import Loading from 'components/Loading'
import { JBChainId } from 'juice-sdk-react'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { CreateBadge } from './components/CreateBadge'
import { FundingCyclesPage } from './components/pages/FundingCycles/FundingCyclesPage'
import { NftRewardsPage } from './components/pages/NftRewards/NftRewardsPage'
import { PayoutsPage } from './components/pages/PayoutsPage/PayoutsPage'
import { LoadCreateStateFromFile } from './components/pages/ProjectDetails/LoadCreateStateFromFile'
import { ProjectDetailsPage } from './components/pages/ProjectDetails/ProjectDetailsPage'
import { ProjectTokenPage } from './components/pages/ProjectToken/ProjectTokenPage'
import { ReconfigurationRulesPage } from './components/pages/ReconfigurationRules/ReconfigurationRulesPage'
import { DeploySuccess } from './components/pages/ReviewDeploy/components/DeploySuccess'
import { SafeQueueSuccess } from './components/pages/ReviewDeploy/components/SafeQueueSuccess'
import { ReviewDeployPage } from './components/pages/ReviewDeploy/ReviewDeployPage'
import { SaveCreateStateToFile } from './components/pages/ReviewDeploy/SaveCreateStateToFile'
import { Wizard } from './components/Wizard/Wizard'
import { DeployProjectButtonText } from './DeployProjectButtonText'
import { useLoadingInitialStateFromQuery } from './hooks/useLoadInitialStateFromQuery'

// Component to combine save and load icons
const SaveLoadIcons = () => {
  return (
    <div className="flex items-center gap-1">
      <SaveCreateStateToFile />
      <LoadCreateStateFromFile />
    </div>
  )
}

export default function Create() {
  const router = useRouter()
  const projectIdsRaw = router.query.projectIds as string
  const safeQueuedRaw = router.query.safeQueued as string
  const chainsRaw = router.query.chains as string
  const initialStateLoading = useLoadingInitialStateFromQuery()
  const projectIds = useMemo(() => {
    if (!projectIdsRaw) {
      return undefined
    }
    try {
      const projectIdsParsed = JSON.parse(projectIdsRaw)
      return projectIdsParsed.map((p: { id: string; c: string }) => {
        return {
          chainId: parseInt(p.c),
          projectId: parseInt(p.id),
        }
      })
    } catch (error) {
      return undefined
    }
  }, [projectIdsRaw])

  const isSafeQueued = safeQueuedRaw === 'true'
  const queuedChains = useMemo(() => {
    if (!chainsRaw) return []
    try {
      return chainsRaw.split(',').map(id => parseInt(id) as JBChainId)
    } catch {
      return []
    }
  }, [chainsRaw])

  if (initialStateLoading) return <Loading />

  if (projectIds) {
    return <DeploySuccess projectIds={projectIds} />
  }

  if (isSafeQueued) {
    return <SafeQueueSuccess chains={queuedChains} />
  }

  return (
    <div className="mt-12 md:mt-10">
      <h1 className="mb-0 text-center font-heading text-base font-medium uppercase text-black dark:text-slate-100">
        <span className="inline-flex gap-2">
          <Trans>Create a project</Trans>
        </span>
      </h1>
      <div className="m-auto mt-[-32px] flex max-w-3xl justify-end">
        <SaveLoadIcons />
      </div>
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
                <p>
                  Anyone can pay ETH to your project. If you wish, specify to
                  which Ethereum wallets or other Juicebox projects this ETH can
                  be split as it comes in.
                </p>
                <p>
                  ETH which <em>isn't</em> paid out will be available for token
                  cash outs, or for use in future rulesets. Payouts reset each
                  ruleset.
                </p>
                <p>Payouts reset each ruleset.</p>
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
                <p>When people pay your project, they receive its tokens.</p>
                <p>
                  Tokens can be cashed out to reclaim ETH from your project
                  depending on how you set your rules below – useful for refunds
                  or sharing funds. They can also be used for utilities across
                  other platforms, like governance or community access.
                </p>
                <p>
                  You can reserve some of your tokens as they are issued and
                  split to your choice of recipients.
                </p>
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
              <Trans>
                <p>Reward your supporters with custom NFTs.</p>
                <p>
                  You can modify each NFT's image later, as well as add new NFTs
                  or remove ones you no longer want. You will not be able to
                  modify any NFT's price or total supply after project launch.
                </p>
              </Trans>
            }
          >
            <NftRewardsPage />
          </Wizard.Page>
          <Wizard.Page
            name="reconfigurationRules"
            title={<Trans>Rule change deadline</Trans>}
            description={DEADLINE_EXPLANATION}
          >
            <ReconfigurationRulesPage />
          </Wizard.Page>
          <Wizard.Page
            className="max-w-full md:w-full md:max-w-3xl"
            name="reviewDeploy"
            title={t`Review & Deploy`}
            description={<Trans>Review your project before deploying.</Trans>}
          >
            <ReviewDeployPage />
          </Wizard.Page>
        </Wizard>
      </div>
    </div>
  )
}
