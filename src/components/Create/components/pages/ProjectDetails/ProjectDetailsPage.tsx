import { t, Trans } from '@lingui/macro'
import { Col, Form, Input, Row, Space } from 'antd'
import { useLockPageRulesWrapper } from 'components/Create/hooks/useLockPageRulesWrapper'
import { FormImageUploader } from 'components/inputs/FormImageUploader'
import PrefixedInput from 'components/PrefixedInput'
import TooltipIcon from 'components/TooltipIcon'
import { useContext } from 'react'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import { getBaseUrlOrigin } from 'utils/baseUrl'
import { CreateCollapse } from '../../CreateCollapse'
import { OptionalHeader } from '../../OptionalHeader'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { inputMustExistRule } from '../utils'
import { useProjectDetailsForm } from './hooks/ProjectDetailsForm'

export const ProjectDetailsPage: React.FC = () => {
  useSetCreateFurthestPageReached('projectDetails')

  const { goToNextPage } = useContext(PageContext)
  const formProps = useProjectDetailsForm()
  const lockPageRulesWrapper = useLockPageRulesWrapper()

  return (
    <Form
      {...formProps}
      name="projectDetails"
      colon={false}
      layout="vertical"
      onFinish={goToNextPage}
      scrollToFirstError
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Form.Item
          name="projectName"
          label={t`Project Name`}
          required
          rules={lockPageRulesWrapper([
            inputMustExistRule({ label: t`Project Name` }),
          ])}
        >
          <Input />
        </Form.Item>
        <Form.Item name="projectDescription" label={t`Project Description`}>
          <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} />
        </Form.Item>
        <Form.Item name="logo" label={t`Logo`}>
          <FormImageUploader text={t`Upload`} />
        </Form.Item>
        <CreateCollapse>
          <CreateCollapse.Panel
            key={0}
            header={<OptionalHeader header={t`Project Links`} />}
            hideDivider
          >
            {/* Adding paddingBottom is a bit of a hack, but horizontal gutters not working */}
            <Row
              gutter={32}
              style={{ paddingBottom: '2rem', paddingTop: '1.25rem' }}
            >
              <Col span={12}>
                <Form.Item name="projectWebsite" label={t`Website`}>
                  {/* Set placeholder as url string origin without port */}
                  <Input placeholder={getBaseUrlOrigin()} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="projectTwitter" label={t`Twitter`}>
                  <PrefixedInput prefix={'@'} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={32} style={{ marginBottom: '1.5rem' }}>
              <Col span={12}>
                <Form.Item name="projectDiscord" label={t`Discord`}>
                  <Input placeholder="https://discord.gg" />
                </Form.Item>
              </Col>
            </Row>
          </CreateCollapse.Panel>
          <CreateCollapse.Panel
            key={1}
            header={<OptionalHeader header={t`Customize Pay Button`} />}
            hideDivider
          >
            <Row
              gutter={32}
              style={{ paddingBottom: '2rem', paddingTop: '1.25rem' }}
            >
              <Col span={12}>
                <Form.Item
                  name="payButtonText"
                  label={
                    <span>
                      <Trans>Pay Button Text</Trans>{' '}
                      <TooltipIcon
                        tip={t`This is the button that contributors will click to pay your project`}
                      />
                    </span>
                  }
                >
                  <Input placeholder={t`Pay`} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="payDisclosure"
              label={
                <span>
                  <Trans>Pay Disclosure</Trans>{' '}
                  <TooltipIcon
                    tip={t`Display a message or warning to contributors before they approve a payment to your project`}
                  />
                </span>
              }
            >
              <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} />
            </Form.Item>
          </CreateCollapse.Panel>
        </CreateCollapse>
      </Space>
      <Wizard.Page.ButtonControl />
    </Form>
  )
}
