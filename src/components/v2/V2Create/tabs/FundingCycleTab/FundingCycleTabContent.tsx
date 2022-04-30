import { Trans } from '@lingui/macro'
import { CheckCircleFilled } from '@ant-design/icons'
import { Button, Drawer, Space } from 'antd'
import RichButton from 'components/shared/RichButton'
import { useContext, useState } from 'react'

import { ThemeContext } from 'contexts/themeContext'

import FundingCycleExplainer from '../../FundingCycleExplainer'
import FundingForm from '../../forms/FundingForm'

import { drawerStyle } from 'constants/styles/drawerStyle'
import TokenForm from '../../forms/TokenForm'
import RulesForm from '../../forms/RulesForm'
import ProjectConfigurationFieldsContainer from '../../ProjectConfigurationFieldsContainer'

export default function FundingCycleTabContent({
  onFinish,
}: {
  onFinish?: VoidFunction
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const [fundingDrawerVisible, setFundingDrawerVisible] = useState<boolean>()
  const [tokenDrawerVisible, setTokenDrawerVisible] = useState<boolean>()
  const [rulesDrawerVisible, setRulesDrawerVisible] = useState<boolean>()

  const fundingDrawerSeen = fundingDrawerVisible !== undefined
  const tokenDrawerSeen = tokenDrawerVisible !== undefined
  const rulesDrawerSeen = rulesDrawerVisible !== undefined

  const seenColor = colors.text.tertiary

  return (
    <ProjectConfigurationFieldsContainer showPreview>
      <Space direction="vertical" style={{ width: '100%' }}>
        <FundingCycleExplainer />
        <RichButton
          prefix="1"
          heading={<Trans>Funding</Trans>}
          onClick={() => {
            setFundingDrawerVisible(true)
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

        <RichButton
          prefix="3"
          heading={<Trans>Rules</Trans>}
          onClick={() => {
            setRulesDrawerVisible(true)
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

      <Drawer
        {...drawerStyle}
        visible={fundingDrawerVisible}
        onClose={() => {
          setFundingDrawerVisible(false)
        }}
        getContainer={false}
        destroyOnClose
      >
        <h1>
          <Trans>Funding</Trans>
        </h1>

        <FundingForm
          onFinish={() => {
            setFundingDrawerVisible(false)
          }}
        />
      </Drawer>
      <Drawer
        {...drawerStyle}
        visible={tokenDrawerVisible}
        onClose={() => {
          setTokenDrawerVisible(false)
        }}
        getContainer={false}
        destroyOnClose
      >
        <h1>
          <Trans>Token</Trans>
        </h1>
        <TokenForm
          onFinish={() => {
            setTokenDrawerVisible(false)
          }}
          isCreate
        />
      </Drawer>
      <Drawer
        {...drawerStyle}
        visible={rulesDrawerVisible}
        onClose={() => {
          setRulesDrawerVisible(false)
        }}
        getContainer={false}
        destroyOnClose
      >
        <h1>
          <Trans>Rules</Trans>
        </h1>

        <RulesForm
          onFinish={() => {
            setRulesDrawerVisible(false)
          }}
        />
      </Drawer>
    </ProjectConfigurationFieldsContainer>
  )
}
