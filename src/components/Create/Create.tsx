import { t, Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { CV_V2, CV_V3 } from 'constants/cv'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { useWallet } from 'hooks/Wallet'
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
} from './components'
import { CreateBadge } from './components/CreateBadge'
import { Wizard } from './components/Wizard'

export function Create() {
  const { chain } = useWallet()
  return (
    <V2V3ContractsProvider
      initialCv={featureFlagEnabled(FEATURE_FLAGS.V3) ? CV_V3 : CV_V2}
    >
      <TransactionProvider>
        <V2V3CurrencyProvider>
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
                  redemptions. <a href="#TODO">Learn more</a>.
                </Trans>
              }
            >
              <ProjectTokenPage />
            </Wizard.Page>
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
            <Wizard.Page name="nextStep" title={t`Empty Step`}>
              <div>TODO</div>
              <Wizard.Page.ButtonControl />
            </Wizard.Page>
          </Wizard>
        </V2V3CurrencyProvider>
      </TransactionProvider>
    </V2V3ContractsProvider>
  )
}
