/* eslint-disable @typescript-eslint/no-explicit-any */

import { ipfsFilePickerReducer } from './ipfsFilePickerReducer'

describe('ipfsFilePickerReducer', () => {
  const DefaultState = {
    isUploading: false,
    uploadedUrl: null,
    uploadError: null,
    uploadProgress: null,
  }
  it('should return the initial state', () => {
    expect(ipfsFilePickerReducer(DefaultState, {} as any)).toEqual({
      isUploading: false,
      uploadedUrl: null,
      uploadError: null,
      uploadProgress: null,
    })
  })

  it('should handle uploading', () => {
    expect(ipfsFilePickerReducer(DefaultState, { type: 'uploading' })).toEqual({
      isUploading: true,
      uploadedUrl: null,
      uploadError: null,
      uploadProgress: null,
    })
  })

  it('should handle uploaded', () => {
    expect(
      ipfsFilePickerReducer(DefaultState, {
        type: 'uploaded',
        url: 'https://example.com',
      }),
    ).toEqual({
      isUploading: false,
      uploadedUrl: 'https://example.com',
      uploadError: null,
      uploadProgress: null,
    })
  })

  it('should handle error', () => {
    expect(
      ipfsFilePickerReducer(DefaultState, {
        type: 'error',
        error: 'Some error',
      }),
    ).toEqual({
      isUploading: false,
      uploadedUrl: null,
      uploadError: 'Some error',
      uploadProgress: null,
    })
  })

  it('should handle progress', () => {
    expect(
      ipfsFilePickerReducer(DefaultState, {
        type: 'progress',
        progress: 0.5,
      }),
    ).toEqual({
      isUploading: false,
      uploadedUrl: null,
      uploadError: null,
      uploadProgress: 0.5,
    })
  })

  it('should handle cancel', () => {
    expect(
      ipfsFilePickerReducer(DefaultState, {
        type: 'cancel',
      }),
    ).toEqual({
      isUploading: false,
      uploadedUrl: null,
      uploadError: null,
      uploadProgress: null,
    })
  })
})
