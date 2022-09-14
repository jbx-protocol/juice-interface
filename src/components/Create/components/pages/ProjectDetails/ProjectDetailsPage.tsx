import { t } from '@lingui/macro'
import { Col, Form, Input, Row, Space } from 'antd'
import { FormImageUploader } from 'components/inputs/FormImageUploader'
import { CreateCollapse } from '../../CreateCollapse'

// TODO: Do we want to set validators on these?
export const ProjectDetailsPage: React.FC = () => {
  return (
    <Form name="projectDetails" colon={false} layout="vertical">
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Form.Item name="projectName" label={t`Project Name`}>
          <Input placeholder={t`Enter project name`} />
        </Form.Item>
        <Form.Item name="projectDescription" label={t`Project Description`}>
          <Input.TextArea
            autoSize={{ minRows: 4, maxRows: 6 }}
            placeholder={t`Enter project description`}
          />
        </Form.Item>
        <Form.Item name="logo" label={t`Logo`}>
          <FormImageUploader text={t`Upload`} />
        </Form.Item>
        <CreateCollapse>
          <CreateCollapse.Panel key={0} header={t`Project Links`}>
            {/* Adding paddingBottom is a bit of a hack, but horizontal gutters not working */}
            <Row gutter={32} style={{ paddingBottom: '32px' }}>
              <Col span={12}>
                <Form.Item name="projectWebsite" label={t`Website`}>
                  <Input placeholder={t`juicebox.com`} />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="projectTwitter" label={t`Twitter`}>
                  <Input placeholder={t`@juiceboxETH`} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={32}>
              <Col span={12}>
                <Form.Item name="projectDiscord" label={t`Discord`}>
                  <Input placeholder={t`discord.gg/xyz`} />
                </Form.Item>
              </Col>
            </Row>
          </CreateCollapse.Panel>
          <CreateCollapse.Panel key={1} header={t`Customise Payment Terminal`}>
            <Row gutter={32} style={{ paddingBottom: '32px' }}>
              <Col span={12}>
                <Form.Item name="payButtonText" label={t`Pay Button Text`}>
                  <Input placeholder={t`'Pay'`} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item name="payDisclosure" label={t`Pay Disclosure`}>
              <Input.TextArea
                autoSize={{ minRows: 4, maxRows: 6 }}
                placeholder={t`Enter pay disclosure`}
              />
            </Form.Item>
          </CreateCollapse.Panel>
        </CreateCollapse>
      </Space>
    </Form>
  )
}
