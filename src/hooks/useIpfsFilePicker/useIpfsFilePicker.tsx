import { pinFile } from 'lib/api/ipfs'
import { UploadProgressEvent } from 'rc-upload/lib/interface'
import { useCallback, useReducer, useRef } from 'react'
import { ipfsGatewayUrl, percentFromUploadProgressEvent } from 'utils/ipfs'
import useFilePicker from '../useFilePicker'
import { ipfsFilePickerReducer } from './ipfsFilePickerReducer'

export function useIpfsFilePicker({
  accept,
  onFileUrlChange,
}: {
  accept: string
  onFileUrlChange?: (url: string | undefined) => void
}) {
  const [state, dispatch] = useReducer(ipfsFilePickerReducer, {
    isUploading: false,
    uploadedUrl: null,
    uploadError: null,
    uploadProgress: null,
  })
  const abortController = useRef(new AbortController())

  const onProgress = useCallback((e: UploadProgressEvent) => {
    const percent = percentFromUploadProgressEvent(e)
    dispatch({ type: 'progress', progress: percent })
  }, [])

  const uploadFile = useCallback(
    async (file: File) => {
      const res = await pinFile(file, onProgress, {
        signal: abortController.current.signal,
      })
      if (!res) throw new Error('Failed to pin file to IPFS')
      const url = ipfsGatewayUrl(res.Hash)
      return url
    },
    [onProgress],
  )

  const onFileChange = useCallback(
    async (selectedFile: File | null) => {
      if (!selectedFile) return
      dispatch({ type: 'uploading' })
      try {
        const uploadedUrl = await uploadFile(selectedFile)
        dispatch({ type: 'uploaded', url: uploadedUrl })
        onFileUrlChange?.(uploadedUrl)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        if (e.name === 'CanceledError' || e.name === 'AbortError') {
          dispatch({ type: 'cancel' })
          onFileUrlChange?.(undefined)
          console.info('Upload canceled')
          return
        }
        console.error('Error occurred while uploading', e)
        dispatch({ type: 'error', error: e.message })
      }
    },
    [onFileUrlChange, uploadFile],
  )

  const {
    selectedFile,
    FileInput,
    openFilePicker,
    removeFile: fpRemoveFile,
  } = useFilePicker({ accept, onFileChange })

  const removeFile = useCallback(() => {
    fpRemoveFile()
    dispatch({ type: 'cancel' })
    onFileUrlChange?.(undefined)
  }, [fpRemoveFile, onFileUrlChange])

  const cancelUpload = useCallback(() => {
    abortController.current.abort()
    abortController.current = new AbortController()
    dispatch({ type: 'cancel' })
    removeFile()
  }, [removeFile])

  return {
    selectedFile,
    ...state,
    FileInput,
    openFilePicker,
    removeFile,
    cancelUpload,
  }
}
