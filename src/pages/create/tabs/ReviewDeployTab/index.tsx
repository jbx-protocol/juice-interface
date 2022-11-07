import { t, Trans } from '@lingui/macro'
import { Checkbox, Form, Space } from 'antd'
import { Gutter } from 'antd/lib/grid/row'
import ExternalLink from 'components/ExternalLink'
import { ThemeContext } from 'contexts/themeContext'
import { useAppSelector } from 'hooks/AppSelector'
import useMobile from 'hooks/Mobile'
import { useContext } from 'react'

import { StartOverButton } from '../../StartOverButton'
import { DeployProjectButton } from './DeployProjectButton'
import { DeployProjectWithNftsButton } from './DeployProjectWithNftsButton'
import FundingSummarySection from './FundingSummarySection'
import NftSummarySection from './NftSummarySection'
import ProjectDetailsSection from './ProjectDetailsSection'

import { TERMS_OF_SERVICE_URL } from 'constants/links'

export const rowGutter: [Gutter, Gutter] = [40, 30]

export default function ReviewDeployTab() {
  const {
    nftRewards: { rewardTiers },
  } = useAppSelector(state => state.editingV2Project)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const isMobile = useMobile()

  const [form] = Form.useForm<{ termsOfServiceCheckbox: boolean }>()

  const hasNfts = Boolean(rewardTiers?.length)

  return (
    <div style={isMobile ? { padding: '0 1rem' } : {}}>
      <div
        style={{
          marginBottom: '2rem',
        }}
      >
        <Space direction="vertical" style={{ width: '100%' }}>
          <ProjectDetailsSection />
          <FundingSummarySection />
          {hasNfts ? <NftSummarySection /> : null}

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
        </Space>
      </div>

      {hasNfts ? (
        <DeployProjectWithNftsButton form={form} />
      ) : (
        <DeployProjectButton form={form} />
      )}
      <StartOverButton />
    </div>
  )
}
