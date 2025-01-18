import { Trans, t } from '@lingui/macro'
import { Col, Form, Row } from 'antd'
import { JBChainId, JB_CHAINS } from 'juice-sdk-core'
import {
  V2V3_CURRENCY_ETH,
  V2V3_CURRENCY_USD,
} from 'packages/v2v3/utils/currency'
import { useCallback, useContext, useState } from 'react'
import { inputMustBeEthAddressRule, inputMustExistRule } from 'utils/antdRules'

import { RightOutlined } from '@ant-design/icons'
import { Callout } from 'components/Callout/Callout'
import { FormItems } from 'components/formItems'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { FormImageUploader } from 'components/inputs/FormImageUploader'
import { JuiceTextArea } from 'components/inputs/JuiceTextArea'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { RichEditor } from 'components/RichEditor'
import { CREATE_FLOW } from 'constants/fathomEvents'
import { constants } from 'ethers'
import { useWallet } from 'hooks/Wallet'
import { trackFathomGoal } from 'lib/fathom'
import Link from 'next/link'
import { useLockPageRulesWrapper } from 'packages/v2v3/components/Create/hooks/useLockPageRulesWrapper'
import { V2V3CurrencyOption } from 'packages/v2v3/models/currencyOption'
import { ProjectChainSelect } from 'packages/v4/components/ProjectDashboard/ProjectChainSelect'
import { useSetCreateFurthestPageReached } from 'redux/hooks/v2v3/useEditingCreateFurthestPageReached'
import { inputIsLengthRule } from 'utils/antdRules/inputIsLengthRule'
import { CreateCollapse } from '../../CreateCollapse/CreateCollapse'
import { OptionalHeader } from '../../OptionalHeader'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { Wizard } from '../../Wizard/Wizard'
import { useProjectDetailsForm } from './hooks/useProjectDetailsForm'

export const ProjectDetailsPage: React.FC<
  React.PropsWithChildren<unknown>
> = () => {
  useSetCreateFurthestPageReached('projectDetails')

  const { goToNextPage } = useContext(PageContext)
  const formProps = useProjectDetailsForm()
  const lockPageRulesWrapper = useLockPageRulesWrapper()
  const wallet = useWallet()

  const inputWalletAddress = Form.useWatch('inputProjectOwner', formProps.form)

  const projectOwnerDifferentThanWalletAddress =
    inputWalletAddress && wallet.userAddress !== inputWalletAddress
  
  const networkOptions = 
    Object.values(JB_CHAINS).map(chain => ({
      label: chain.name,
      value: chain.chain.id as JBChainId,
    }))

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

        <Form.Item
          name="projectChainId"
          label={t`Project chain`}
          required
          rules={lockPageRulesWrapper([
            inputMustExistRule({ label: t`A project chain` }),
          ])}
        >
          {/* v4TODO: turn into a multiselect */}
          <ProjectChainSelect options={networkOptions} />
        </Form.Item>

        <Form.Item
          name="projectTagline"
          label={t`Tagline`}
          extra={t`Add a brief one-sentence summary of your project.`}
          rules={lockPageRulesWrapper([
            inputIsLengthRule({
              label: t`Tagline`,
              max: 100,
            }),
          ])}
        >
          <JuiceInput />
        </Form.Item>

        <Form.Item name="projectDescription" label={t`Project description`}>
          <RichEditor />
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
                  <TwitterHandleInputWrapper />
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
              <EthAddressInput placeholder={constants.AddressZero} />
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
            header={<OptionalHeader header={t`Project tags`} />}
            hideDivider
          >
            <FormItems.ProjectTags
              name="tags"
              hideLabel
              initialTags={formProps.form.getFieldValue('tags')}
            />
          </CreateCollapse.Panel>
          <CreateCollapse.Panel
            key={3}
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
          <Link href="/contact" className="text-sm hover:underline">
            <Trans>Contact a contributor</Trans>{' '}
            <RightOutlined className="text-xs" />
          </Link>
        </div>
      </div>
    </Form>
  )
}

// Only relevant to Juicecrowd

export type AmountInputValue = {
  amount: string
  currency: V2V3CurrencyOption
}

const AmountInput = ({
  value,
  onChange,
}: {
  value?: AmountInputValue
  onChange?: (input: AmountInputValue | undefined) => void
}) => {
  const [_amount, _setAmount] = useState<AmountInputValue>({
    amount: '',
    currency: V2V3_CURRENCY_USD,
  })
  const amount = value ?? _amount
  const setAmount = onChange ?? _setAmount

  const onAmountInputChange = useCallback(
    (value: AmountInputValue | undefined) => {
      if (value && !isNaN(parseFloat(value.amount))) {
        setAmount(value)
        return
      }
    },
    [setAmount],
  )

  return (
    <div className="flex w-full items-center gap-4">
      <FormattedNumberInput
        className="flex-1"
        value={amount.amount}
        onChange={val =>
          onAmountInputChange(
            val ? { amount: val, currency: amount.currency } : undefined,
          )
        }
        accessory={
          <span>{amount.currency === V2V3_CURRENCY_ETH ? 'ETH' : 'USD'}</span>
        }
      />
    </div>
  )
}

// Exists just to solve an issue where a user might paste a twitter url instead of just the handle
export const TwitterHandleInputWrapper = ({
  value,
  onChange,
}: {
  value?: string
  onChange?: (val: string) => void
}) => {
  const [_value, _setValue] = useState<string>(value ?? '')
  const setValue = onChange ?? _setValue
  value = value ?? _value

  const onInputChange = useCallback(
    (value: string | undefined) => {
      const httpOrHttpsRegex = /^(http|https):\/\//
      if (value?.length && value.match(httpOrHttpsRegex)) {
        const handle = value.split('/').pop()
        if (handle) {
          setValue(handle)
          return
        }
      }
      setValue(value ?? '')
    },
    [setValue],
  )

  return (
    <JuiceInput
      value={value}
      onChange={e => onInputChange(e.target.value)}
      prefix="@"
    />
  )
}
