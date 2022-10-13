import { t } from '@lingui/macro'
import { Upload, UploadProps } from 'antd'
import { RcFile } from 'antd/lib/upload'
import { FormItemInput } from 'models/formItemInput'
import { ReactNode, useCallback, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'

interface UploadNoStyleProps
  extends FormItemInput<string | undefined>,
    Omit<
      UploadProps,
      'onChange' | 'showUploadList' | 'children' | 'customRequest'
    > {
  sizeLimit?: number
  supportedFileTypes?: Set<'image/jpeg' | 'image/png' | 'image/gif'>
  customRequest?: (req: File | Blob | string) => Promise<string> | string
  children?: (props: {
    isUploading: boolean
    uploadUrl: string | undefined
    undo: VoidFunction
  }) => ReactNode
}

export const UploadNoStyle = (props: UploadNoStyleProps) => {
  const [_uploadUrl, _setUploadUrl] = useState<string>()
  const [isUploading, setIsUploading] = useState<boolean>(false)

  const uploadUrl = props.value ?? _uploadUrl
  const setUploadUrl = props.onChange ?? _setUploadUrl

  const undo = useCallback(() => setUploadUrl(undefined), [setUploadUrl])

  const handleBeforeUpload = useCallback(
    (file: RcFile) => {
      const fileIsAllowed = props.supportedFileTypes?.size
        ? ([...props.supportedFileTypes] as string[]).includes(file.type)
        : true
      const isInSizeLimit = props.sizeLimit
        ? file.size / 1024 / 1024 < props.sizeLimit
        : true

      if (!isInSizeLimit) {
        emitErrorNotification(
          t`File must be less than ${props.sizeLimit ?? '??'}MB`,
        )
      }
      if (!fileIsAllowed) {
        emitErrorNotification(
          t`File must be in a format of ${[
            ...(props.supportedFileTypes ?? []),
          ].join(', ')}`,
        )
      }

      return isInSizeLimit && fileIsAllowed
    },
    [props.sizeLimit, props.supportedFileTypes],
  )

  return (
    <Upload
      {...props}
      style={{ width: '100%' }}
      onChange={undefined}
      beforeUpload={handleBeforeUpload}
      customRequest={
        props.customRequest
          ? async req => {
              setIsUploading(true)
              try {
                const val = await props.customRequest?.(req.file)
                setUploadUrl(val)
              } catch (e) {
                console.error('Error occurred while uploading', e)
              } finally {
                setIsUploading(false)
              }
            }
          : undefined
      }
      showUploadList={false}
    >
      {props.children ? props.children({ uploadUrl, isUploading, undo }) : null}
    </Upload>
  )
}
