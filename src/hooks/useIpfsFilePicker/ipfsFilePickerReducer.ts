export type IpfsFilePickerState = {
  isUploading: boolean
  uploadedUrl: string | null
  uploadError: string | null
  uploadProgress: number | null
}

export type IpfsFilePickerAction =
  | {
      type: 'uploading'
    }
  | {
      type: 'uploaded'
      url: string
    }
  | {
      type: 'error'
      error: string
    }
  | {
      type: 'progress'
      progress: number
    }
  | {
      type: 'cancel'
    }

export const ipfsFilePickerReducer = (
  state: IpfsFilePickerState,
  action: IpfsFilePickerAction,
): IpfsFilePickerState => {
  switch (action.type) {
    case 'uploading':
      return {
        ...state,
        uploadedUrl: null,
        isUploading: true,
        uploadError: null,
        uploadProgress: null,
      }
    case 'uploaded':
      return {
        ...state,
        isUploading: false,
        uploadedUrl: action.url,
        uploadError: null,
        uploadProgress: null,
      }
    case 'error':
      return {
        ...state,
        isUploading: false,
        uploadError: action.error,
        uploadProgress: null,
      }
    case 'progress':
      return {
        ...state,
        uploadProgress: action.progress,
      }
    case 'cancel':
      return {
        ...state,
        uploadedUrl: null,
        uploadError: null,
        isUploading: false,
        uploadProgress: null,
      }
    default:
      return state
  }
}
