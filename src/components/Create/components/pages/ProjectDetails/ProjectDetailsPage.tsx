import { RightOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { ADDRESS_ZERO } from '@uniswap/v3-sdk'
import { Col, Form, Row } from 'antd'
import { Callout } from 'components/Callout/Callout'
import { useLockPageRulesWrapper } from 'components/Create/hooks/useLockPageRulesWrapper'
import { FormItems } from 'components/formItems'
import { EthAddressInput } from 'components/inputs/EthAddressInput'
import FormattedNumberInput from 'components/inputs/FormattedNumberInput'
import { FormImageUploader } from 'components/inputs/FormImageUploader'
import { JuiceTextArea } from 'components/inputs/JuiceTextArea'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import PrefixedInput from 'components/inputs/PrefixedInput'
import { RichEditor } from 'components/RichEditor'
import { CREATE_FLOW } from 'constants/fathomEvents'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { useWallet } from 'hooks/Wallet'
import { trackFathomGoal } from 'lib/fathom'
import { V2V3CurrencyOption } from 'models/v2v3/currencyOption'
import Link from 'next/link'
import { useCallback, useContext, useMemo, useState } from 'react'
import { useSetCreateFurthestPageReached } from 'redux/hooks/useEditingCreateFurthestPageReached'
import { inputMustBeEthAddressRule, inputMustExistRule } from 'utils/antdRules'
import { inputIsLengthRule } from 'utils/antdRules/inputIsLengthRule'
import { featureFlagEnabled } from 'utils/featureFlags'
import { V2V3_CURRENCY_ETH, V2V3_CURRENCY_USD } from 'utils/v2v3/currency'
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

  const startTimestamp = Form.useWatch('startTimestamp', formProps.form)

  // just for juicecrowd
  const launchDate = useMemo(() => {
    if (!startTimestamp) {
      return null
    }
    const number = Number(startTimestamp)
    if (isNaN(number)) {
      return null
    }

    let date
    if (number > 1000000000000) {
      date = new Date(number)
    } else {
      date = new Date(number * 1000)
    }

    // format in local timezone
    return {
      local: date.toLocaleString(),
      utc: date.toUTCString(),
    }
  }, [startTimestamp])

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
          {featureFlagEnabled(
            FEATURE_FLAGS.JUICE_CROWD_METADATA_CONFIGURATION,
          ) && (
            <CreateCollapse.Panel
              key={4}
              header={<OptionalHeader header={t`👷‍♂️ Juicecrowd`} />}
              hideDivider
            >
              <Form.Item
                name="introVideoUrl"
                label={t`Intro video YouTube URL`}
                tooltip={t`Add a YouTube video to the top of your Juicecrowd project's page. Video will take priority over image`}
              >
                <JuiceInput />
              </Form.Item>

              <Form.Item
                name="introImageUri"
                label={t`Intro image`}
                tooltip={t`Add a Intro image to the top of the Juicecrowd project's page. If a video is also included, the video will always take priority.`}
              >
                <FormImageUploader text={t`Upload`} maxSizeKBs={10000} />
              </Form.Item>

              <Form.Item
                name="softTarget"
                label={<Trans>Soft target for funding</Trans>}
                tooltip={t`The soft target for the juicecrowd project. Note: this is not a cap, but a expected target for the project.`}
              >
                <AmountInput />
              </Form.Item>

              {/* <Form.Item
                name="startTimestamp"
                label={<Trans>Start date timestamp</Trans>}
                tooltip={t`The timestamp for the start of the project.`}
              >
                <JuiceInput />
              </Form.Item> */}
              {launchDate && (
                <div className="text-gray-500 text-sm">
                  {t`Launch date: ${launchDate.local} (${launchDate.utc})`}
                </div>
              )}
            </CreateCollapse.Panel>
          )}
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
