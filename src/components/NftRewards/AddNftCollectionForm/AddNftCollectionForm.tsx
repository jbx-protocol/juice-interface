import { RightOutlined } from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import { Form, FormInstance } from 'antd'
import { useLockPageRulesWrapper } from 'components/Create/hooks/useLockPageRulesWrapper'
import ExternalLink from 'components/ExternalLink'
import TooltipLabel from 'components/TooltipLabel'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { NftRewardTier } from 'models/nftRewards'
import { inputMustExistRule } from 'utils/antdRules'
import { CreateCollapse } from '../../Create/components/CreateCollapse/CreateCollapse'
import { OptionalHeader } from '../../Create/components/OptionalHeader'
import { RewardsList } from '../RewardsList/RewardsList'
import { NftAdvancedFormItems } from './NftAdvancedFormItems'
import { NftPaymentSuccessFormItems } from './NftPaymentSuccessFormItems'

export type NftRewardsFormProps = Partial<{
  rewards: NftRewardTier[]
  collectionName?: string
  collectionSymbol?: string
  collectionDescription?: string
  postPayMessage?: string
  postPayButtonText?: string
  postPayButtonLink?: string
  useDataSourceForRedeem: boolean
  preventOverspending: boolean
}>

export const AddNftCollectionForm = ({
  form,
  initialValues,
  okButton,
  onFinish,
}: {
  form: FormInstance<NftRewardsFormProps>
  initialValues?: NftRewardsFormProps
  okButton: React.ReactNode
  onFinish?: VoidFunction
}) => {
  const lockPageRulesWrapper = useLockPageRulesWrapper()

  const hasNfts = !!Form.useWatch('rewards', form)?.length

  return (
    <>
      <Form
        form={form}
        initialValues={initialValues}
        name="fundingCycles"
        colon={false}
        layout="vertical"
        onFinish={onFinish}
        scrollToFirstError
      >
        <div className="flex flex-col gap-6">
          <Form.Item noStyle name="rewards">
            <RewardsList allowCreate />
          </Form.Item>

          {hasNfts && (
            <div className="flex flex-col gap-4 pt-3 pb-2">
              <Form.Item
                name="collectionName"
                label={
                  <TooltipLabel
                    label={t`Collection Name`}
                    tip={
                      <Trans>
                        A collection's name is the full name used on NFT
                        marketplaces (like{' '}
                        <ExternalLink href="https://opensea.io/">
                          OpenSea
                        </ExternalLink>
                        ).
                      </Trans>
                    }
                  />
                }
                required
                rules={lockPageRulesWrapper([
                  inputMustExistRule({ label: t`Collection Name` }),
                ])}
              >
                <JuiceInput />
              </Form.Item>

              <Form.Item
                name="collectionSymbol"
                label={
                  <TooltipLabel
                    label={t`Collection Symbol`}
                    tip={
                      <Trans>
                        A collection's symbol is typically a 3-4 letter acronym
                        or abbreviation of its name. The symbol is used on NFT
                        marketplaces (like{' '}
                        <ExternalLink href="https://opensea.io/">
                          OpenSea
                        </ExternalLink>
                        ).
                      </Trans>
                    }
                  />
                }
                required
                rules={lockPageRulesWrapper([
                  inputMustExistRule({ label: t`Collection Symbol` }),
                ])}
              >
                <JuiceInput />
              </Form.Item>

              <Form.Item
                name="collectionDescription"
                label={<Trans>Collection Description</Trans>}
              >
                <JuiceInput />
              </Form.Item>

              <CreateCollapse>
                <CreateCollapse.Panel
                  key={2}
                  header={<OptionalHeader header={t`Payment Success Pop-up`} />}
                  hideDivider
                >
                  <NftPaymentSuccessFormItems />
                </CreateCollapse.Panel>

                <CreateCollapse.Panel
                  key={3}
                  header={<OptionalHeader header={t`Advanced options`} />}
                  hideDivider
                >
                  <NftAdvancedFormItems />
                </CreateCollapse.Panel>
              </CreateCollapse>
            </div>
          )}
        </div>
        {okButton}
      </Form>

      <div className="mt-8 text-center">
        <Trans>Need artwork?</Trans>
        <div>
          <ExternalLink
            href="https://discord.gg/XnYFFGaXsu"
            className="text-sm hover:underline"
          >
            <Trans>Contact WAGMI Studios</Trans>{' '}
            <RightOutlined className="text-xs" />
          </ExternalLink>
        </div>
      </div>
    </>
  )
}
