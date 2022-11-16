import { EyeOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Form, Input, Space } from 'antd'
import { NftPostPayModal } from 'components/NftRewards/NftPostPayModal'
import TooltipLabel from 'components/TooltipLabel'
import { useAppSelector } from 'hooks/AppSelector'
import { useModal } from 'hooks/Modal'
import { useContext } from 'react'
import { useSetCreateFurthestPageReached } from 'redux/hooks/EditingCreateFurthestPageReached'
import { CreateButton } from '../../CreateButton'
import { CreateCollapse } from '../../CreateCollapse'
import { OptionalHeader } from '../../OptionalHeader'
import { RewardsList } from '../../RewardsList'
import { Wizard } from '../../Wizard'
import { PageContext } from '../../Wizard/contexts/PageContext'
import { useNftRewardsForm } from './hooks'

export const NftRewardsPage = () => {
  useSetCreateFurthestPageReached('nftRewards')
  const { form, initialValues } = useNftRewardsForm()
  const { goToNextPage } = useContext(PageContext)

  const postPayModal = useModal()
  const postPayModalData = useAppSelector(
    state => state.editingV2Project.nftRewards.postPayModal,
  )

  return (
    <>
      <Form
        form={form}
        initialValues={initialValues}
        name="fundingCycles"
        colon={false}
        layout="vertical"
        onFinish={goToNextPage}
        scrollToFirstError
      >
        <Space style={{ width: '100%' }} direction="vertical" size="large">
          <Form.Item noStyle name="rewards">
            <RewardsList allowCreate />
          </Form.Item>

          <Space
            direction="vertical"
            size="middle"
            style={{ width: '100%', padding: '0.75rem 0 0.5rem 0' }}
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
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="collectionSymbol"
              label={
                <TooltipLabel
                  label={t`Collection Symbol`}
                  tip={
                    <Trans>
                      Your collection's symbol is used on NFT marketplaces (for
                      example, OpenSea).
                    </Trans>
                  }
                />
              }
              required
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="collectionDescription"
              label={<Trans>Collection Description</Trans>}
            >
              <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} />
            </Form.Item>

            <CreateCollapse>
              <CreateCollapse.Panel
                key={1}
                header={<OptionalHeader header={t`Payment Success Popup`} />}
                hideDivider
              >
                <Space
                  direction="vertical"
                  size="middle"
                  style={{ width: '100%', padding: '0.75rem 0 0.5rem 0' }}
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
                    <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} />
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
                    <Input />
                  </Form.Item>
                  <Form.Item
                    name="postPayButtonLink"
                    label={<Trans>Button link</Trans>}
                    extra={t`Button will close the modal if no link is given.`}
                  >
                    <Input prefix={'https://'} />
                  </Form.Item>
                  <CreateButton
                    disabled={!postPayModalData}
                    style={{ border: '1px solid' }}
                    icon={<EyeOutlined />}
                    onClick={postPayModal.open}
                  >
                    Preview
                  </CreateButton>
                </Space>
              </CreateCollapse.Panel>
            </CreateCollapse>
          </Space>
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
