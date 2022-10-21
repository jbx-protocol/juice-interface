import { t, Trans } from '@lingui/macro'
import { DeployButtonText } from 'components/DeployProjectButtonText'
import ExternalLink from 'components/ExternalLink'
import { CV_V2, CV_V3 } from 'constants/cv'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { useRouter } from 'next/router'
import { TransactionProvider } from 'providers/TransactionProvider'
import { V2V3ContractsProvider } from 'providers/v2v3/V2V3ContractsProvider'
import { V2V3CurrencyProvider } from 'providers/v2v3/V2V3CurrencyProvider'
import { featureFlagEnabled } from 'utils/featureFlags'
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
import { Wizard } from './components/Wizard'

export function Create() {
  const router = useRouter()
  const deployedProjectId = router.query.deployedProjectId as string
  if (deployedProjectId) {
    const projectId = parseInt(deployedProjectId)
    return <DeploySuccess projectId={projectId} />
  }

  return (
    <V2V3ContractsProvider
      initialCv={featureFlagEnabled(FEATURE_FLAGS.V3) ? CV_V3 : CV_V2}
    >
      <TransactionProvider>
        <V2V3CurrencyProvider>
          <Wizard className="wizard-create" doneText={<DeployButtonText />}>
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
            <Wizard.Page
              name="fundingTarget"
              title={t`Funding Target`}
              description={t`Select the option that best suits your project’s funding requirements.`}
            >
              <FundingTargetPage />
            </Wizard.Page>
            <Wizard.Page
              name="payouts"
              title={t`Payouts`}
              description={t`Choose which addresses to pay and how to split the total payout amount each funding cycle. How do I decide?`}
            >
              <PayoutsPage />
            </Wizard.Page>
            <Wizard.Page
              name="projectToken"
              title={t`Project Token`}
              description={
                <Trans>
                  Design how your project's tokens should work. You can use your
                  project tokens for governance, ownership & treasury
                  redemptions.{' '}
                  <ExternalLink href="https://info.juicebox.money/dev/learn/glossary/tokens">
                    Learn more
                  </ExternalLink>
                  .
                </Trans>
              }
            >
              <ProjectTokenPage />
            </Wizard.Page>
            {featureFlagEnabled(FEATURE_FLAGS.NFT_REWARDS) && (
              <Wizard.Page
                name="nftRewards"
                title={
                  <Trans>
                    NFT Rewards <CreateBadge.Optional />
                  </Trans>
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
            )}
            <Wizard.Page
              name="reconfigurationRules"
              title={<Trans>Reconfiguration Rules</Trans>}
              description={
                <Trans>Configure restrictions for your funding cycle.</Trans>
              }
            >
              <ReconfigurationRulesPage />
            </Wizard.Page>
            <Wizard.Page
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
              maxWidth="800px"
            >
              <ReviewDeployPage />
            </Wizard.Page>
          </Wizard>
        </V2V3CurrencyProvider>
      </TransactionProvider>
    </V2V3ContractsProvider>
  )
}
