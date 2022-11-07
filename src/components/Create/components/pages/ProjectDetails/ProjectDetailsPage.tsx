import { t } from '@lingui/macro'
import { Col, Form, Input, Row, Space } from 'antd'
import { useLockPageRulesWrapper } from 'components/Create/hooks/useLockPageRulesWrapper'
import { FormImageUploader } from 'components/inputs/FormImageUploader'
import { useContext } from 'react'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
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
                  <Input />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="projectTwitter" label={t`Twitter`}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={32} style={{ marginBottom: '1.5rem' }}>
              <Col span={12}>
                <Form.Item name="projectDiscord" label={t`Discord`}>
                  <Input />
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
                <Form.Item name="payButtonText" label={t`Pay Button Text`}>
                  <Input />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="payDisclosure" label={t`Pay Disclosure`}>
              <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} />
            </Form.Item>
          </CreateCollapse.Panel>
        </CreateCollapse>
      </Space>
      <Wizard.Page.ButtonControl />
    </Form>
  )
}
