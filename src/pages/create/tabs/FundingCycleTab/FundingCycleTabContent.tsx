import { CheckCircleFilled } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Space } from 'antd'
import RichButton from 'components/RichButton'
import FundingDrawer from 'components/v2v3/shared/FundingCycleConfigurationDrawers/FundingDrawer'
import NftDrawer from 'components/v2v3/shared/FundingCycleConfigurationDrawers/NftDrawer'
import RulesDrawer from 'components/v2v3/shared/FundingCycleConfigurationDrawers/RulesDrawer'
import TokenDrawer from 'components/v2v3/shared/FundingCycleConfigurationDrawers/TokenDrawer'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { ThemeContext } from 'contexts/themeContext'
import { useContext, useState } from 'react'
import { featureFlagEnabled } from 'utils/featureFlags'
import FundingCycleExplainer from '../../FundingCycleExplainer'
import { ProjectConfigurationFieldsContainer } from '../../ProjectConfigurationFieldsContainer'

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
  const [NftDrawerVisible, setNftDrawerVisible] = useState<boolean>(false)

  const [fundingDrawerSeen, setFundingDrawerSeen] = useState<boolean>(false)
  const [tokenDrawerSeen, setTokenDrawerSeen] = useState<boolean>(false)
  const [rulesDrawerSeen, setRulesDrawerSeen] = useState<boolean>(false)
  const [NftDrawerSeen, setNftDrawerSeen] = useState<boolean>(false)

  const seenColor = colors.text.tertiary

  const closeDrawer = () => {
    setFundingDrawerVisible(false)
    setTokenDrawerVisible(false)
    setRulesDrawerVisible(false)
    setNftDrawerVisible(false)
  }

  const isNftRewardsEnabled = featureFlagEnabled(FEATURE_FLAGS.NFT_REWARDS)

  return (
    <ProjectConfigurationFieldsContainer showPreview>
      <Space direction="vertical" style={{ width: '100%' }}>
        <p>
          <Trans>
            Juicebox projects are funded in cycles. You can think of this as a
            set period of time in which your project settings are locked.
          </Trans>
        </p>
        <p>
          <Trans>Configure your project's first funding cycle below.</Trans>
        </p>
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
          description={<Trans>Configure your project's token.</Trans>}
          icon={
            tokenDrawerSeen ? (
              <CheckCircleFilled style={{ color: seenColor }} />
            ) : undefined
          }
          primaryColor={tokenDrawerSeen ? seenColor : undefined}
        />
        {isNftRewardsEnabled ? (
          <RichButton
            prefix="3"
            heading={<Trans>NFTs</Trans>}
            onClick={() => {
              setNftDrawerVisible(true)
              setNftDrawerSeen(true)
            }}
            description={<Trans>Reward contributors with NFT's.</Trans>}
            icon={
              NftDrawerSeen ? (
                <CheckCircleFilled style={{ color: seenColor }} />
              ) : undefined
            }
            primaryColor={NftDrawerSeen ? colors.text.tertiary : undefined}
          />
        ) : null}

        <RichButton
          prefix={isNftRewardsEnabled ? '4' : '3'}
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

        <FundingCycleExplainer />

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
        open={fundingDrawerVisible}
        onClose={closeDrawer}
        isCreate
      />
      <TokenDrawer open={tokenDrawerVisible} onClose={closeDrawer} isCreate />
      <NftDrawer open={NftDrawerVisible} onClose={closeDrawer} />
      <RulesDrawer open={rulesDrawerVisible} onClose={closeDrawer} />
    </ProjectConfigurationFieldsContainer>
  )
}
