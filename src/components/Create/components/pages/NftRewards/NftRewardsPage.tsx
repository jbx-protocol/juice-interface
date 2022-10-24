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
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
          <Form.Item noStyle name="rewards">
            <RewardsList />
          </Form.Item>
          <CreateCollapse>
            <CreateCollapse.Panel
              key={0}
              header={<OptionalHeader header={t`Marketplace Customizations`} />}
              hideDivider
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Form.Item
                  name="collectionName"
                  label={
                    <TooltipLabel
                      label={t`Collection Name`}
                      tip={
                        <Trans>
                          The name of the collection that will be shown on NFT
                          marketplaces (e.g. OpenSea).
                        </Trans>
                      }
                    />
                  }
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
                          The symbol of the collection that will be shown on NFT
                          marketplaces (e.g. OpenSea).
                        </Trans>
                      }
                    />
                  }
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name="collectionDescription"
                  label={<Trans>Collection Description</Trans>}
                >
                  <Input.TextArea autoSize={{ minRows: 4, maxRows: 6 }} />
                </Form.Item>
              </Space>
            </CreateCollapse.Panel>
            <CreateCollapse.Panel
              key={1}
              header={<OptionalHeader header={t`Payment Success Popup`} />}
              hideDivider
            >
              <Space direction="vertical" style={{ width: '100%' }}>
                <Form.Item
                  name="postPayMessage"
                  label={
                    <TooltipLabel
                      label={t`Message`}
                      tip={
                        <Trans>
                          The message that will be shown to the user after they
                          pay for an NFT.
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
                          The text that will be shown to the user on the button
                          post pay popup.
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
                  label={<Trans>Call-to-action button link</Trans>}
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
          <Wizard.Page.ButtonControl />
        </div>
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
