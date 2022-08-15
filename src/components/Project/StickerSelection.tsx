import { Space } from 'antd'
import { CloseCircleFilled } from '@ant-design/icons'
import { useContext } from 'react'
import { ThemeContext } from 'contexts/themeContext'
import { IconedImage } from 'components/IconedImage'

export const StickerSelection = ({
  value,
  onChange,
}: {
  value?: string[]
  onChange?: (value: string[]) => void
}) => {
  const {
    theme: { colors },
  } = useContext(ThemeContext)
  const handleImageDeletion = (i: number) => {
    if (!value) {
      onChange?.([])
      return
    }
    const editedImages = [...value.slice(0, i), ...value.slice(i + 1)]
    onChange?.(editedImages)
  }
  return (
    <Space
      style={{ paddingTop: '0.8rem' }}
      direction="horizontal"
      align="start"
    >
      {value?.map((url, i) => (
        <IconedImage
          key={`${i}-${url}`}
          url={url}
          width={50}
          icon={
            <CloseCircleFilled
              style={{ color: colors.text.primary, fontSize: '1rem' }}
            />
          }
          onClick={() => handleImageDeletion(i)}
        />
      ))}
    </Space>
  )
}
