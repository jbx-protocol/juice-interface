import { Input } from 'antd'
import Sticker from 'components/icons/Sticker'
import { AttachStickerModal } from 'components/modals/AttachStickerModal/AttachStickerModal'
import { useState } from 'react'

export function MemoFormInput({
  value,
  onChange,
  placeholder,
}: {
  value?: string
  onChange?: (memo: string) => void
  placeholder?: string
}) {
  const [attachStickerModalVisible, setAttachStickerModalVisible] =
    useState<boolean>(false)

  return (
    <>
      <div className="relative">
        <Input.TextArea
          placeholder={placeholder ?? undefined}
          maxLength={256}
          value={value}
          onChange={e => onChange?.(e.target.value)}
          showCount
          autoSize
        />
        <Sticker
          onClick={() => setAttachStickerModalVisible(true)}
          size={20}
          className="absolute right-[5px] top-[7px] text-sm text-grey-500 dark:text-grey-300"
        />
      </div>
      <AttachStickerModal
        open={attachStickerModalVisible}
        onClose={() => setAttachStickerModalVisible(false)}
        onSelect={sticker => {
          if (typeof window === 'undefined') {
            return
          }
          const url = new URL(`${window.location.origin}${sticker.filepath}`)
          const urlString = url.toString()

          onChange?.(value?.length ? `${value} ${urlString}` : urlString)
        }}
      />
    </>
  )
}
