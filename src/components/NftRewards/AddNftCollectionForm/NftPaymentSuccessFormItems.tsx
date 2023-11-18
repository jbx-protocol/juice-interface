import { EyeOutlined } from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import { Form } from 'antd'
import { NftPostPayModal } from 'components/NftRewards/NftPostPayModal'
import TooltipLabel from 'components/TooltipLabel'
import { CreateButton } from 'components/buttons/CreateButton/CreateButton'

import { JuiceTextArea } from 'components/inputs/JuiceTextArea'
import { JuiceInput } from 'components/inputs/JuiceTextInput'
import { useModal } from 'hooks/useModal'
import { useAppSelector } from 'redux/hooks/useAppSelector'

export function NftPaymentSuccessFormItems({
  hidePreview,
}: {
  hidePreview?: boolean
}) {
  const postPayModal = useModal()
  const postPayModalData = useAppSelector(
    state => state.editingV2Project.nftRewards.postPayModal,
  )
  return (
    <>
      <div className="flex flex-col gap-4 pt-3 pb-2">
        <p>
          <Trans>
            Show your supporters a pop-up with a message and a link after they
            receive an NFT. You can use this to direct supporters to your
            project's website, a Discord server, or somewhere else.
          </Trans>
        </p>
        <Form.Item
          name="postPayMessage"
          label={
            <TooltipLabel
              label={t`Message`}
              tip={
                <Trans>
                  The message that will be shown to supporters after they
                  receive an NFT.
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
                  The text on the button at the bottom of the pop-up. You can
                  preview this below.
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
                  Supporters will be sent to this page if they click the button
                  on your pop-up. You can preview this below.
                </Trans>
              }
            />
          }
          extra={t`If you leave this blank, the button will close the pop-up.`}
        >
          <JuiceInput prefix={'https://'} />
        </Form.Item>
        {hidePreview ? null : (
          <CreateButton
            className="max-w-fit border"
            disabled={!postPayModalData}
            icon={<EyeOutlined />}
            onClick={postPayModal.open}
          >
            Preview
          </CreateButton>
        )}
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
