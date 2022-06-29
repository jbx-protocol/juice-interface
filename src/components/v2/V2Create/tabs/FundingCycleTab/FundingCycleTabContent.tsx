import { Trans } from '@lingui/macro'
import { CheckCircleFilled } from '@ant-design/icons'
import { Button, Space } from 'antd'
import RichButton from 'components/shared/RichButton'
import { useContext, useState } from 'react'

import { ThemeContext } from 'contexts/themeContext'
import NFTDrawer from 'components/v2/shared/FundingCycleConfigurationDrawers/NFTDrawer'
import { enableFeatureFlag, featureFlagEnabled } from 'utils/featureFlags'

import FundingDrawer from '../../../shared/FundingCycleConfigurationDrawers/FundingDrawer'
import TokenDrawer from '../../../shared/FundingCycleConfigurationDrawers/TokenDrawer'
import RulesDrawer from '../../../shared/FundingCycleConfigurationDrawers/RulesDrawer'

import FundingCycleExplainer from '../../FundingCycleExplainer'
import ProjectConfigurationFieldsContainer from '../../ProjectConfigurationFieldsContainer'

export default function FundingCycleTabContent({
  onFinish,
}: {
  onFinish?: VoidFunction
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [fundingDrawerVisible, setFundingDrawerVisible] =
    useState<boolean>(false)
  const [tokenDrawerVisible, setTokenDrawerVisible] = useState<boolean>(false)
  const [rulesDrawerVisible, setRulesDrawerVisible] = useState<boolean>(false)
  const [NFTDrawerVisible, setNFTDrawerVisible] = useState<boolean>(false)

  const [fundingDrawerSeen, setFundingDrawerSeen] = useState<boolean>(false)
  const [tokenDrawerSeen, setTokenDrawerSeen] = useState<boolean>(false)
  const [rulesDrawerSeen, setRulesDrawerSeen] = useState<boolean>(false)
  const [NFTDrawerSeen, setNFTDrawerSeen] = useState<boolean>(false)

  const seenColor = colors.text.tertiary

  const closeDrawer = () => {
    setFundingDrawerVisible(false)
    setTokenDrawerVisible(false)
    setRulesDrawerVisible(false)
    setNFTDrawerVisible(false)
  }

  enableFeatureFlag('nftRewards')

  return (
    <ProjectConfigurationFieldsContainer showPreview>
      <Space direction="vertical" style={{ width: '100%' }}>
        <FundingCycleExplainer />
        <RichButton
          prefix="1"
          heading={<Trans>Funding</Trans>}
          onClick={() => {
            setFundingDrawerVisible(true)
            setFundingDrawerSeen(true)
          }}
          description={
            <Trans>
              Configure how your project will collect and spend funds.
            </Trans>
          }
          icon={
            fundingDrawerSeen ? (
              <CheckCircleFilled style={{ color: seenColor }} />
            ) : undefined
          }
          primaryColor={fundingDrawerSeen ? colors.text.tertiary : undefined}
        />

        <RichButton
          prefix="2"
          heading={<Trans>Token</Trans>}
          onClick={() => {
            setTokenDrawerVisible(true)
            setTokenDrawerSeen(true)
          }}
          description={
            <Trans>Configure the dynamics of your project's token.</Trans>
          }
          icon={
            tokenDrawerSeen ? (
              <CheckCircleFilled style={{ color: seenColor }} />
            ) : undefined
          }
          primaryColor={tokenDrawerSeen ? seenColor : undefined}
        />
        {featureFlagEnabled('nftRewards') ? (
          <RichButton
            prefix="3"
            heading={<Trans>NFT rewards</Trans>}
            onClick={() => {
              setNFTDrawerVisible(true)
              setNFTDrawerSeen(true)
            }}
            description={<Trans>Reward contributors with NFT's.</Trans>}
            icon={
              NFTDrawerSeen ? (
                <CheckCircleFilled style={{ color: seenColor }} />
              ) : undefined
            }
            primaryColor={fundingDrawerSeen ? colors.text.tertiary : undefined}
          />
        ) : null}

        <RichButton
          prefix={featureFlagEnabled('nftRewards') ? '4' : '3'}
          heading={<Trans>Rules</Trans>}
          onClick={() => {
            setRulesDrawerVisible(true)
            setRulesDrawerSeen(true)
          }}
          description={
            <Trans>Configure restrictions for your funding cycles.</Trans>
          }
          icon={
            rulesDrawerSeen ? (
              <CheckCircleFilled style={{ color: seenColor }} />
            ) : undefined
          }
          primaryColor={rulesDrawerSeen ? seenColor : undefined}
        />

        <Button
          type="primary"
          onClick={onFinish}
          style={{ marginTop: '1rem' }}
          size="large"
        >
          <Trans>Next: Review and deploy</Trans>
        </Button>
      </Space>
      <FundingDrawer
        visible={fundingDrawerVisible}
        onClose={closeDrawer}
        isCreate
      />
      <TokenDrawer
        visible={tokenDrawerVisible}
        onClose={closeDrawer}
        isCreate
      />
      <NFTDrawer visible={NFTDrawerVisible} onClose={closeDrawer} />
      <RulesDrawer visible={rulesDrawerVisible} onClose={closeDrawer} />
    </ProjectConfigurationFieldsContainer>
  )
}
