import { t } from '@lingui/macro'
import { Form, Input } from 'antd'
import { SmileOutlined } from '@ant-design/icons'
import BannyAttachModal from 'components/shared/modals/BannyAttachModal'
import { useContext, useState } from 'react'
import { ThemeContext } from 'contexts/themeContext'

export default function MemoFormItem({
  value,
  onChange,
}: {
  value: string
  onChange: (memo: string) => void
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const [bannyAttachModalVisible, setBannyAttachModalVisible] =
    useState<boolean>(false)
  return (
    <>
      <Form.Item
        label={t`Memo`}
        name="memo"
        className={'antd-no-number-handler'}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          <Input.TextArea
            placeholder={t`(Optional) Add a memo to this payment on-chain`}
            maxLength={256}
            value={value}
            onChange={e => onChange(e.target.value)}
            showCount
            autoSize
          />
          <div
            style={{
              color: colors.text.primary,
              fontSize: '.8rem',
              position: 'absolute',
              right: 5,
            }}
          >
            <SmileOutlined onClick={() => setBannyAttachModalVisible(true)} />
          </div>
        </div>
      </Form.Item>
      <BannyAttachModal
        visible={bannyAttachModalVisible}
        onClose={() => setBannyAttachModalVisible(false)}
        onBannySelected={bannyUrl => {
          const url = window.location.origin + bannyUrl
          if (!bannyUrl) return
          onChange(value.length ? value + ' ' + url : url)
        }}
      />
    </>
  )
}
