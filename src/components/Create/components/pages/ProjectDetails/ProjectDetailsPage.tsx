import { RightOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { ADDRESS_ZERO } from '@uniswap/v3-sdk'
import { Col, Form, Row } from 'antd'
import { Callout } from 'components/Callout'
import { useLockPageRulesWrapper } from 'components/Create/hooks/useLockPageRulesWrapper'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import { FormImageUploader } from 'components/inputs/FormImageUploader'
import { JuiceTextArea } from 'components/inputs/JuiceTextArea'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import PrefixedInput from 'components/PrefixedInput'
import { CREATE_FLOW } from 'constants/fathomEvents'
import { useWallet } from 'hooks/Wallet'
import { trackFathomGoal } from 'lib/fathom'
import Link from 'next/link'
import { useContext } from 'react'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import { inputMustBeEthAddressRule, inputMustExistRule } from 'utils/antdRules'
import { CreateCollapse } from '../../CreateCollapse'
import { OptionalHeader } from '../../OptionalHeader'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { useProjectDetailsForm } from './hooks/ProjectDetailsForm'

export const ProjectDetailsPage: React.FC = () => {
  useSetCreateFurthestPageReached('projectDetails')

  const { goToNextPage } = useContext(PageContext)
  const formProps = useProjectDetailsForm()
  const lockPageRulesWrapper = useLockPageRulesWrapper()
  const wallet = useWallet()

  const inputWalletAddress = Form.useWatch('inputProjectOwner', formProps.form)

  const projectOwnerDifferentThanWalletAddress =
    inputWalletAddress && wallet.userAddress !== inputWalletAddress

  return (
    <Form
      {...formProps}
      name="projectDetails"
      colon={false}
      layout="vertical"
      onFinish={() => {
        goToNextPage?.()
        trackFathomGoal(CREATE_FLOW.DETAILS_NEXT_CTA)
      }}
      scrollToFirstError
    >
      <div className="flex flex-col gap-6">
        <Form.Item
          name="projectName"
          label={t`Project name`}
          required
          rules={lockPageRulesWrapper([
            inputMustExistRule({ label: t`A project name` }),
          ])}
        >
          <JuiceInput />
        </Form.Item>
        <Form.Item name="projectDescription" label={t`Project description`}>
          <JuiceTextArea autoSize={{ minRows: 4, maxRows: 6 }} />
        </Form.Item>
        <Form.Item name="logo" label={t`Logo`}>
          <FormImageUploader text={t`Upload`} maxSizeKBs={10000} />
        </Form.Item>
        <CreateCollapse>
          <CreateCollapse.Panel
            key={0}
            header={<OptionalHeader header={t`Project links`} />}
            hideDivider
          >
            {/* Adding paddingBottom is a bit of a hack, but horizontal gutters not working */}
            <Row className="pb-8 pt-5" gutter={32}>
              <Col span={12}>
                <Form.Item name="projectWebsite" label={t`Website`}>
                  {/* Set placeholder as url string origin without port */}
                  <JuiceInput prefix="https://" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="projectTwitter" label={t`Twitter handle`}>
                  <PrefixedInput prefix={'@'} />
                </Form.Item>
              </Col>
            </Row>
            <Row className="mb-6" gutter={32}>
              <Col span={12}>
                <Form.Item name="projectDiscord" label={t`Discord`}>
                  <JuiceInput prefix="https://" />
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item name="projectTelegram" label={t`Telegram`}>
                  <JuiceInput prefix="https://" />
                </Form.Item>
              </Col>
            </Row>
          </CreateCollapse.Panel>
          <CreateCollapse.Panel
            key={1}
            header={<OptionalHeader header={t`Project owner`} />}
            hideDivider
          >
            <Form.Item
              className="pb-8 pt-5"
              name="inputProjectOwner"
              label={t`Project owner address`}
              extra={t`Leave this blank to make your currently connected wallet the project owner. Fill this out with an Ethereum address to make that address this project's owner.`}
              rules={lockPageRulesWrapper([
                inputMustBeEthAddressRule({
                  label: t`Project owner address`,
                }),
              ])}
            >
              <EthAddressInput placeholder={ADDRESS_ZERO} />
            </Form.Item>
            {projectOwnerDifferentThanWalletAddress && (
              <Callout.Warning collapsible={false}>
                <Trans>
                  Warning: Only the project owner can edit a project. If you
                  don't have access to the address above, you will lose access
                  to your project.
                </Trans>
              </Callout.Warning>
            )}
          </CreateCollapse.Panel>
          <CreateCollapse.Panel
            key={2}
            header={<OptionalHeader header={t`Project page customizations`} />}
            hideDivider
          >
            <Form.Item
              name="coverImage"
              label={t`Cover image`}
              tooltip={t`Add a banner to the top of your project's page.`}
              extra={t`1400x256 recommended.`}
            >
              <FormImageUploader text={t`Upload`} maxSizeKBs={10000} />
            </Form.Item>

            <Row className="pb-8 pt-5" gutter={32}>
              <Col span={12}>
                <Form.Item
                  name="payButtonText"
                  label={<Trans>Pay button text</Trans>}
                  tooltip={t`The text on the button supporters will click to pay your project`}
                  extra={t`Use a simple term like 'Pay' or 'Donate'.`}
                >
                  <JuiceInput placeholder={t`Pay`} />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item
              name="payDisclosure"
              label={<Trans>Payment notice</Trans>}
              tooltip={t`Show a disclosure, a message, or a warning to supporters before they pay your project`}
            >
              <JuiceTextArea autoSize={{ minRows: 4, maxRows: 6 }} />
            </Form.Item>
          </CreateCollapse.Panel>
        </CreateCollapse>
      </div>

      <Wizard.Page.ButtonControl />

      <div className="mt-12 text-center">
        <Trans>Need help?</Trans>
        <div>
          <Link href="/contact">
            <a className="text-sm hover:underline">
              <Trans>Contact a contributor</Trans>{' '}
              <RightOutlined className="text-xs" />
            </a>
          </Link>
        </div>
      </div>
    </Form>
  )
}
