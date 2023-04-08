import { EyeOutlined, RightOutlined } from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import { Form, Radio } from 'antd'
import { useLockPageRulesWrapper } from 'components/Create/hooks/useLockPageRulesWrapper'
import ExternalLink from 'components/ExternalLink'
import { NftPostPayModal } from 'components/NftRewards/NftPostPayModal'
import { RadioItem } from 'components/RadioItem'
import TooltipLabel from 'components/TooltipLabel'
import { CreateButton } from 'components/buttons/CreateButton'
import { JuiceSwitch } from 'components/inputs/JuiceSwitch'
import { JuiceTextArea } from 'components/inputs/JuiceTextArea'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import {
  PREVENT_OVERSPENDING_EXPLANATION,
  USE_DATASOURCE_FOR_REDEEM_EXPLANATION,
} from 'components/v2v3/V2V3Project/V2V3FundingCycleSection/settingExplanations'
import { CREATE_FLOW } from 'constants/fathomEvents'
import { useModal } from 'hooks/Modal'
import { trackFathomGoal } from 'lib/fathom'
import { JB721GovernanceType } from 'models/nftRewards'
import { useContext } from 'react'
import { useAppSelector } from 'redux/hooks/AppSelector'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import { inputMustExistRule } from 'utils/antdRules'
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
                        value={JB721GovernanceType.GLOBAL}
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
                      <RadioItem
                        value={JB721GovernanceType.TIERED}
                        title={t`Tier-based on-chain governance`}
                        description={
                          <Trans>
                            Instead of tracking total voting power, track each
                            address' voting power within each tier over time.
                            This can be useful for running multiple voting
                            processes out of one treasury, or for complex
                            on-chain governance.
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
                  <div className="flex flex-col gap-4 pt-3 pb-2">
                    <p>
                      <Trans>
                        Show your supporters a pop-up with a message and a link
                        after they receive an NFT. You can use this to direct
                        supporters to your project's website, a Discord server,
                        or somewhere else.
                      </Trans>
                    </p>
                    <Form.Item
                      name="postPayMessage"
                      label={
                        <TooltipLabel
                          label={t`Message`}
                          tip={
                            <Trans>
                              The message that will be shown to supporters after
                              they receive an NFT.
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
                          label={t`Button label`}
                          tip={
                            <Trans>
                              The text on the button at the bottom of the
                              pop-up. You can preview this below.
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
                              Supporters will be sent to this page if they click
                              the button on your pop-up. You can preview this
                              below.
                            </Trans>
                          }
                        />
                      }
                      extra={t`If you leave this blank, the button will close the pop-up.`}
                    >
                      <JuiceInput prefix={'https://'} />
                    </Form.Item>
                    <CreateButton
                      className="max-w-fit border border-solid"
                      disabled={!postPayModalData}
                      icon={<EyeOutlined />}
                      onClick={postPayModal.open}
                    >
                      Preview
                    </CreateButton>
                  </div>
                </CreateCollapse.Panel>

                <CreateCollapse.Panel
                  key={3}
                  header={<OptionalHeader header={t`Advanced options`} />}
                  hideDivider
                >
                  <Form.Item
                    name="useDataSourceForRedeem"
                    extra={USE_DATASOURCE_FOR_REDEEM_EXPLANATION}
                  >
                    <JuiceSwitch label={t`Use NFTs for redemptions`} />
                  </Form.Item>
                  <Form.Item
                    name="preventOverspending"
                    extra={PREVENT_OVERSPENDING_EXPLANATION}
                  >
                    <JuiceSwitch label={t`Prevent NFT overspending`} />
                  </Form.Item>
                </CreateCollapse.Panel>
              </CreateCollapse>
            </div>
          )}
        </div>
        <Wizard.Page.ButtonControl />
      </Form>

      <div className="mt-8 text-center">
        <Trans>Need artwork?</Trans>
        <div>
          <ExternalLink href="https://discord.gg/XnYFFGaXsu">
            <a className="text-sm hover:underline">
              <Trans>Contact WAGMI Studios</Trans>{' '}
              <RightOutlined className="text-xs" />
            </a>
          </ExternalLink>
        </div>
      </div>

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
