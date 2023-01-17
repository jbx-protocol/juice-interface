import { t } from '@lingui/macro'
import { Upload, UploadProps } from 'antd'
import { RcFile } from 'antd/lib/upload'
import { FormItemInput } from 'models/formItemInput'
import { ReactNode, useCallback, useState } from 'react'
import { emitErrorNotification } from 'utils/notifications'
import { UploadRequestOption } from 'rc-upload/lib/interface'

interface UploadNoStyleProps
  extends FormItemInput<string | undefined>,
    Omit<
      UploadProps,
      'onChange' | 'showUploadList' | 'children' | 'customRequest'
    > {
  sizeLimit?: number
  supportedFileTypes?: Set<'image/jpeg' | 'image/png' | 'image/gif'>
  customRequest?: (options: UploadRequestOption) => Promise<string> | string
  children?: (props: {
    percent: number | undefined
    isUploading: boolean
    uploadUrl: string | undefined
    undo: VoidFunction
  }) => ReactNode
}

export const UploadNoStyle = (props: UploadNoStyleProps) => {
  const [_uploadUrl, _setUploadUrl] = useState<string>()
  const [isUploading, setIsUploading] = useState<boolean>(false)
  const [percent, setPercent] = useState<number | undefined>(undefined)

  const uploadUrl = props.value ?? _uploadUrl
  const setUploadUrl = props.onChange ?? _setUploadUrl

  const undo = useCallback(() => setUploadUrl(undefined), [setUploadUrl])

  const handleBeforeUpload = useCallback(
    async (file: RcFile) => {
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

      const childCheck = await props.beforeUpload?.(file, [])

      return isInSizeLimit && fileIsAllowed && childCheck
    },
    [props],
  )

  const onCustomRequest = useCallback(
    async (req: UploadRequestOption) => {
      if (!props.customRequest) return
      setIsUploading(true)
      setPercent(0)
      try {
        const val = await props.customRequest({
          ...req,
          onProgress: e => {
            req.onProgress?.(e)
            if (e) {
              // Bit of a hack
              setPercent(e as unknown as number)
            }
          },
        })
        setUploadUrl(val)
      } catch (e) {
        console.error('Error occurred while uploading', e)
      } finally {
        setIsUploading(false)
      }
    },
    [props, setUploadUrl],
  )

  return (
    <Upload
      {...props}
      className="w-full"
      onChange={undefined}
      beforeUpload={handleBeforeUpload}
      customRequest={onCustomRequest}
      showUploadList={false}
    >
      {props.children
        ? props.children({ uploadUrl, isUploading, undo, percent })
        : null}
    </Upload>
  )
}
