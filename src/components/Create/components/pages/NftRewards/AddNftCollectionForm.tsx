import { RightOutlined } from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import { Form, Radio } from 'antd'
import { useLockPageRulesWrapper } from 'components/Create/hooks/useLockPageRulesWrapper'
import ExternalLink from 'components/ExternalLink'
import TooltipLabel from 'components/TooltipLabel'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { RadioItem } from 'components/inputs/RadioItem'
import { CREATE_FLOW } from 'constants/fathomEvents'
import { trackFathomGoal } from 'lib/fathom'
import { JB721GovernanceType } from 'models/nftRewards'
import { useContext } from 'react'
import { useSetCreateFurthestPageReached } from 'redux/hooks/useEditingCreateFurthestPageReached'
import { inputMustExistRule } from 'utils/antdRules'
import { helpPagePath } from 'utils/routes'
import { CreateBadge } from '../../CreateBadge'
import { CreateCollapse } from '../../CreateCollapse'
import { OptionalHeader } from '../../OptionalHeader'
import { RewardsList } from '../../RewardsList'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { NftAdvancedFormItems } from './NftAdvancedFormItems'
import { NftPaymentSuccessFormItems } from './NftPaymentSuccessFormItems'
import { useNftRewardsForm } from './hooks'

export const AddNftCollectionForm = ({
  okButton,
}: {
  okButton?: React.ReactNode
}) => {
  useSetCreateFurthestPageReached('nftRewards')
  const { form, initialValues } = useNftRewardsForm()
  const lockPageRulesWrapper = useLockPageRulesWrapper()
  const { goToNextPage } = useContext(PageContext)

  const hasNfts = !!Form.useWatch('rewards', form)?.length

  return (
    <>
      <Form
        form={form}
        initialValues={initialValues}
        name="fundingCycles"
        colon={false}
        layout="vertical"
        onFinish={() => {
          goToNextPage?.()
          trackFathomGoal(CREATE_FLOW.NFT_NEXT_CTA)
        }}
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
                  key={1}
                  header={<OptionalHeader header={t`On-chain Governance`} />}
                  hideDivider
                >
                  <Form.Item name="onChainGovernance">
                    <Radio.Group className="flex flex-col gap-5">
                      <RadioItem
                        value={JB721GovernanceType.NONE}
                        title={
                          <div className="flex items-center gap-3">
                            <Trans>No on-chain governance</Trans>{' '}
                            <CreateBadge.Default />
                          </div>
                        }
                        description={t`Your project's NFTs will not have on-chain governance capabilities. Select this option if you don't want governance, or if you plan to use an off-chain voting client (like Snapshot).`}
                      />
                      <RadioItem
                        value={JB721GovernanceType.ONCHAIN}
                        title={t`Standard on-chain governance`}
                        description={
                          <Trans>
                            Track the total voting power of each address over
                            time.{' '}
                            <ExternalLink
                              href={helpPagePath(
                                '/user/configuration/#on-chain-governance',
                              )}
                            >
                              Learn more.
                            </ExternalLink>
                          </Trans>
                        }
                      />
                    </Radio.Group>
                  </Form.Item>
                </CreateCollapse.Panel>
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
        {okButton ?? <Wizard.Page.ButtonControl />}
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
