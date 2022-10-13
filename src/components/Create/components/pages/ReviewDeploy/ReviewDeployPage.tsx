import { CheckCircleFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { CreateCollapse } from '../../CreateCollapse'
import { Wizard } from '../../Wizard'
import {
  FundingConfigurationReview,
  ProjectDetailsReview,
  ProjectTokenReview,
  RewardsReview,
  RulesReview,
} from './components'

const Header: React.FC = ({ children }) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  return (
    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      {children}
      <CheckCircleFilled style={{ color: colors.background.action.primary }} />
    </h3>
  )
}

export const ReviewDeployPage = () => {
  return (
    <>
      <CreateCollapse>
        <CreateCollapse.Panel
          key={0}
          header={
            <Header>
              <Trans>Project Details</Trans>
            </Header>
          }
        >
          <ProjectDetailsReview />
        </CreateCollapse.Panel>
        <CreateCollapse.Panel
          key={1}
          header={
            <Header>
              <Trans>Funding Configuration</Trans>
            </Header>
          }
        >
          <FundingConfigurationReview />
        </CreateCollapse.Panel>
        <CreateCollapse.Panel
          key={2}
          header={
            <Header>
              <Trans>Project Token</Trans>
            </Header>
          }
        >
          <ProjectTokenReview />
        </CreateCollapse.Panel>
        <CreateCollapse.Panel
          key={3}
          header={
            <Header>
              <Trans>NFT Rewards</Trans>
            </Header>
          }
        >
          <RewardsReview />
        </CreateCollapse.Panel>
        <CreateCollapse.Panel
          key={4}
          header={
            <Header>
              <Trans>Rules</Trans>
            </Header>
          }
        >
          <RulesReview />
        </CreateCollapse.Panel>
      </CreateCollapse>
      <Wizard.Page.ButtonControl />
    </>
  )
}
