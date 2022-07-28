import { Checkbox, Form, Space } from 'antd'
import { Gutter } from 'antd/lib/grid/row'
import useMobile from 'hooks/Mobile'
import { useAppSelector } from 'hooks/AppSelector'
import { t, Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { useContext } from 'react'
import { ThemeContext } from 'contexts/themeContext'

import DeployProjectButton from './DeployProjectButton'
import ProjectDetailsSection from './ProjectDetailsSection'
import FundingSummarySection from './FundingSummarySection'
import NftSummarySection from './NftSummarySection'
import { StartOverButton } from '../../StartOverButton'
import { DeployProjectWithNftsButton } from './DeployProjectWithNftsButton'

import { TERMS_OF_SERVICE_URL } from 'constants/links'

export const rowGutter: [Gutter, Gutter] = [40, 30]

export default function ReviewDeployTab() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { nftRewardTiers } = useAppSelector(state => state.editingV2Project)
  const isMobile = useMobile()

  const [form] = Form.useForm<{ termsOfServiceCheckbox: boolean }>()

  const hasNfts = Boolean(nftRewardTiers?.length)

  return (
    <div style={isMobile ? { padding: '0 1rem' } : {}}>
      <div
        style={{
          marginBottom: '2rem',
        }}
      >
        <Space size="large" direction="vertical" style={{ width: '100%' }}>
          <ProjectDetailsSection />
          <FundingSummarySection />
          {hasNfts ? <NftSummarySection /> : null}
        </Space>

        <Form form={form}>
          <Form.Item
            name="termsOfServiceCheckbox"
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value
                    ? Promise.resolve()
                    : Promise.reject(
                        new Error(
                          t`You must review and accept the Terms of Service.`,
                        ),
                      ),
              },
            ]}
            style={{
              padding: '1rem',
              border: `1px solid ${colors.stroke.secondary}`,
              marginBottom: 0,
            }}
          >
            <Checkbox>
              <Trans>
                I have read and accept the{' '}
                <ExternalLink href={TERMS_OF_SERVICE_URL}>
                  Terms of Service
                </ExternalLink>
                .
              </Trans>
            </Checkbox>
          </Form.Item>
        </Form>
      </div>

      {hasNfts ? <DeployProjectWithNftsButton /> : <DeployProjectButton />}
      <StartOverButton />
    </div>
  )
}
