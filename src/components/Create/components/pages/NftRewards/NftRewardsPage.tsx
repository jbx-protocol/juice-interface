import { EyeOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Form, Radio, Space } from 'antd'
import { CreateButton } from 'components/buttons/CreateButton'
import { useLockPageRulesWrapper } from 'components/Create/hooks/useLockPageRulesWrapper'
import ExternalLink from 'components/ExternalLink'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import { JuiceTextArea } from 'components/inputs/JuiceTextArea'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { NftPostPayModal } from 'components/NftRewards/NftPostPayModal'
import { RadioItem } from 'components/RadioItem'
import TooltipLabel from 'components/TooltipLabel'
import {
  PREVENT_OVERSPENDING_EXPLAINATION,
  USE_DATASOURCE_FOR_REDEEM_EXPLAINATION,
} from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/settingExplanations'
import { CREATE_FLOW } from 'constants/fathomEvents'
import { FEATURE_FLAGS } from 'constants/featureFlags'
import { useModal } from 'hooks/Modal'
import { trackFathomGoal } from 'lib/fathom'
import { JB721GovernanceType } from 'models/nftRewards'
import { useContext } from 'react'
import { useAppSelector } from 'redux/hooks/AppSelector'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import { inputMustExistRule } from 'utils/antdRules'
import { featureFlagEnabled } from 'utils/featureFlags'
import { helpPagePath } from 'utils/routes'
import { CreateBadge } from '../../CreateBadge'
import { CreateCollapse } from '../../CreateCollapse'
import { OptionalHeader } from '../../OptionalHeader'
import { RewardsList } from '../../RewardsList'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { useNftRewardsForm } from './hooks'

export const NftRewardsPage = () => {
  useSetCreateFurthestPageReached('nftRewards')
  const { form, initialValues } = useNftRewardsForm()
  const lockPageRulesWrapper = useLockPageRulesWrapper()
  const { goToNextPage } = useContext(PageContext)

  const postPayModal = useModal()
  const postPayModalData = useAppSelector(
    state => state.editingV2Project.nftRewards.postPayModal,
  )

  const delegateV1_1Enabled = featureFlagEnabled(FEATURE_FLAGS.DELEGATE_V1_1)
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
        <Space className="w-full" direction="vertical" size="large">
          <Form.Item noStyle name="rewards">
            <RewardsList allowCreate />
          </Form.Item>

          {hasNfts && (
            <Space
              className="w-full pt-3 pb-2"
              direction="vertical"
              size="middle"
            >
              <Form.Item
                name="collectionName"
                label={
                  <TooltipLabel
                    label={t`Collection Name`}
                    tip={
                      <Trans>
                        Your collection's name is used on NFT marketplaces (for
                        example, OpenSea).
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
                        Your collection's symbol is used on NFT marketplaces
                        (for example, OpenSea).
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
                        description={t`Your project's NFTs will not have on-chain governance capabilities.`}
                      />
                      <RadioItem
                        value={JB721GovernanceType.GLOBAL}
                        title={t`Standard on-chain governance`}
                        description={
                          <Trans>
                            Track the historical voting weight of each token
                            holder across all tiers of NFTs.{' '}
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
                      <RadioItem
                        value={JB721GovernanceType.TIERED}
                        title={t`Tier-based on-chain governance`}
                        description={
                          <Trans>
                            Track the historical voting weight of each token
                            holder within each tier of NFTs.{' '}
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
                  header={<OptionalHeader header={t`Payment Success Popup`} />}
                  hideDivider
                >
                  <Space
                    className="w-full pt-3 pb-2"
                    direction="vertical"
                    size="middle"
                  >
                    <p>
                      <Trans>
                        Show contributors a popup when they receive an NFT.
                      </Trans>
                    </p>
                    <Form.Item
                      name="postPayMessage"
                      label={
                        <TooltipLabel
                          label={t`Message`}
                          tip={
                            <Trans>
                              The message that will be shown to the user after
                              they pay for an NFT.
                            </Trans>
                          }
                        />
                      }
                    >
                      <JuiceTextArea autoSize={{ minRows: 4, maxRows: 6 }} />
                    </Form.Item>
                    <Form.Item
                      name="postPayButtonText"
                      label={
                        <TooltipLabel
                          label={t`Button Text`}
                          tip={
                            <Trans>
                              The text that will be shown to the user on the
                              button post pay popup.
                              <br />
                              <strong>
                                For more information, see the preview.
                              </strong>
                            </Trans>
                          }
                        />
                      }
                    >
                      <JuiceInput />
                    </Form.Item>
                    <Form.Item
                      name="postPayButtonLink"
                      label={
                        <TooltipLabel
                          label={t`Button link`}
                          tip={
                            <Trans>
                              Link contributors to another page after they
                              successfully mint one of your project's NFTs.
                            </Trans>
                          }
                        />
                      }
                      extra={t`Button will close the modal if no link is given.`}
                    >
                      <JuiceInput prefix={'https://'} />
                    </Form.Item>
                    <CreateButton
                      className="border border-solid"
                      disabled={!postPayModalData}
                      icon={<EyeOutlined />}
                      onClick={postPayModal.open}
                    >
                      Preview
                    </CreateButton>
                  </Space>
                </CreateCollapse.Panel>

                <CreateCollapse.Panel
                  key={3}
                  header={<OptionalHeader header={t`Advanced options`} />}
                  hideDivider
                >
                  <Form.Item
                    name="useDataSourceForRedeem"
                    extra={USE_DATASOURCE_FOR_REDEEM_EXPLAINATION}
                  >
                    <JuiceSwitch label={t`Redeemable NFTs`} />
                  </Form.Item>
                  {delegateV1_1Enabled ? (
                    <Form.Item
                      name="preventOverspending"
                      extra={PREVENT_OVERSPENDING_EXPLAINATION}
                    >
                      <JuiceSwitch label={t`Prevent NFT overspending`} />
                    </Form.Item>
                  ) : null}
                </CreateCollapse.Panel>
              </CreateCollapse>
            </Space>
          )}
        </Space>
        <Wizard.Page.ButtonControl />
      </Form>
      {postPayModalData && (
        <NftPostPayModal
          open={postPayModal.visible}
          config={postPayModalData}
          onClose={postPayModal.close}
        />
      )}
    </>
  )
}
