import { t, Trans } from '@lingui/macro'
import { Space } from 'antd'
import { DeployButtonText } from 'components/DeployProjectButtonText'
import ExternalLink from 'components/ExternalLink'
import { CV_V3 } from 'constants/cv'
import { ThemeContext } from 'contexts/themeContext'
import { useRouter } from 'next/router'
import { TransactionProvider } from 'providers/TransactionProvider'
import { V2V3ContractsProvider } from 'providers/v2v3/V2V3ContractsProvider'
import { V2V3CurrencyProvider } from 'providers/v2v3/V2V3CurrencyProvider'
import { useContext } from 'react'
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
import { RecallCard } from './components/RecallCard'
import { Wizard } from './components/Wizard'

export function Create() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const router = useRouter()
  const deployedProjectId = router.query.deployedProjectId as string
  if (deployedProjectId) {
    const projectId = parseInt(deployedProjectId)
    return <DeploySuccess projectId={projectId} />
  }

  return (
    // New projects will be launched using V3 contracts.
    <V2V3ContractsProvider initialCv={CV_V3}>
      <TransactionProvider>
        <V2V3CurrencyProvider>
          <h1
            style={{
              textAlign: 'center',
              textTransform: 'uppercase',
              fontWeight: 500,
              fontSize: '1rem',
              lineHeight: '33px',
              color: colors.text.primary,
              marginBottom: 0,
            }}
          >
            <Trans>Create a project</Trans>
          </h1>
          <Wizard
            className="wizard-create"
            doneText={<DeployButtonText />}
            style={{ paddingBottom: '100px' }}
          >
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
              description={
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
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
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                  }}
                >
                  <Trans>
                    Select how you would like to distribute payouts. Then,
                    choose which Ethereum wallets to pay each funding cycle.
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
            <Wizard.Page
              name="nftRewards"
              title={
                <Space>
                  <Trans>NFTs</Trans>
                  <CreateBadge.Optional />
                </Space>
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
