/**
 * @jest-environment jsdom
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { act } from '@testing-library/react'
import { renderHook } from '@testing-library/react-hooks'
import useFilePicker from 'hooks/useFilePicker'
import { pinFile } from 'lib/api/ipfs'
import { ipfsGatewayUrl } from 'utils/ipfs'
import { IpfsFilePickerState } from './ipfsFilePickerReducer'
import { useIpfsFilePicker } from './useIpfsFilePicker'

jest.mock('lib/api/ipfs')
jest.mock('../useFilePicker')

describe('useIpfsFilePicker', () => {
  const onFileUrlChangeMock = jest.fn()
  let concreteOnFileChange: (file: File | null) => Promise<void>
  const consoleError = console.error
  const file = new File([''], 'filename')

  beforeEach(() => {
    ;(pinFile as jest.Mock).mockResolvedValue({ Hash: 'hash' })(
      useFilePicker as jest.Mock,
    )
    ;(useFilePicker as jest.Mock).mockImplementation(
      ({ onFileChange }: any) => {
        concreteOnFileChange = onFileChange
        return {
          selectedFile: null,
          FileInput: null,
          openFilePicker: jest.fn(),
          removeFile: jest.fn(),
        }
      },
    )
    onFileUrlChangeMock.mockClear()
    // mock console.error to avoid seeing error messages in the console
    console.error = jest.fn()
  })

  afterEach(() => {
    console.error = consoleError
  })

  // helper function to handle the repeated File creation and action within act function
  const testFileAction = async (fileAction: (file: File) => Promise<void>) => {
    await act(async () => {
      try {
        await fileAction(file)
      } catch (e) {
        // ignore
      }
    })
  }

  // helper function to handle assertions
  const testCurrentState = (
    current: IpfsFilePickerState & { selectedFile: File | null },
    { isUploading, uploadedUrl, uploadError, uploadProgress }: any,
  ) => {
    expect(current.selectedFile).toBeNull()
    expect(current.isUploading).toBe(isUploading)
    expect(current.uploadedUrl).toBe(uploadedUrl)
    expect(current.uploadError).toBe(uploadError)
    expect(current.uploadProgress).toBe(uploadProgress)
  }

  const errorCases = [
    { errorName: 'CanceledError', errorMessage: 'canceled', uploadError: null },
    { errorName: 'AbortError', errorMessage: 'aborted', uploadError: null },
    {
      errorName: 'UnknownError',
      errorMessage: 'unknown',
      uploadError: 'unknown',
    },
  ]

  it('should return the correct initial state', () => {
    const { result } = renderHook(() =>
      useIpfsFilePicker({
        accept: 'image/*',
        onFileUrlChange: onFileUrlChangeMock,
      }),
    )
    expect(result.current.selectedFile).toBeNull()
    expect(result.current.isUploading).toBe(false)
    expect(result.current.uploadedUrl).toBeNull()
    expect(result.current.uploadError).toBeNull()
    expect(result.current.uploadProgress).toBeNull()
  })

  it('should call useFilePicker with the correct arguments', () => {
    renderHook(() =>
      useIpfsFilePicker({
        accept: 'image/*',
        onFileUrlChange: onFileUrlChangeMock,
      }),
    )
    expect(useFilePicker).toHaveBeenCalledWith({
      accept: 'image/*',
      onFileChange: expect.any(Function),
    })
  })

  it('should call pinFile with the correct arguments', async () => {
    const { result } = renderHook(() =>
      useIpfsFilePicker({
        accept: 'image/*',
        onFileUrlChange: onFileUrlChangeMock,
      }),
    )
    const file = new File([''], 'filename')
    await act(async () => {
      await concreteOnFileChange(file)
    })
    expect(pinFile).toHaveBeenCalledWith(
      file,
      expect.any(Function),
      expect.anything(),
    )
    expect(result.current.isUploading).toBe(false)
    expect(result.current.uploadedUrl).toBe(ipfsGatewayUrl('hash'))
    expect(result.current.uploadError).toBeNull()
    expect(result.current.uploadProgress).toBeNull()
  })

  errorCases.forEach(({ errorName, errorMessage, uploadError }) => {
    it(`should set the correct state when pinFile throws a ${errorName}`, async () => {
      ;(pinFile as jest.Mock).mockRejectedValue({
        name: errorName,
        message: errorMessage,
      })
      const { result } = renderHook(() =>
        useIpfsFilePicker({
          accept: 'image/*',
          onFileUrlChange: onFileUrlChangeMock,
        }),
      )

      await testFileAction(concreteOnFileChange)
      testCurrentState(result.current, {
        isUploading: false,
        uploadedUrl: null,
        uploadError,
        uploadProgress: null,
      })
    })
  })

  // Refactoring removeFile and cancelUpload tests
  const actionCases = ['removeFile', 'cancelUpload']

  actionCases.forEach(action => {
    errorCases.forEach(({ errorName, errorMessage, uploadError }) => {
      it(`should set the correct state when ${action} is called after a ${errorName}`, async () => {
        ;(pinFile as jest.Mock).mockRejectedValue({
          name: errorName,
          message: errorMessage,
        })
        const { result } = renderHook(() =>
          useIpfsFilePicker({
            accept: 'image/*',
            onFileUrlChange: onFileUrlChangeMock,
          }),
        )

        await testFileAction(concreteOnFileChange)
        testCurrentState(result.current, {
          isUploading: false,
          uploadedUrl: null,
          uploadError,
          uploadProgress: null,
        })

        await testFileAction((result.current as any)[action])
        testCurrentState(result.current, {
          isUploading: false,
          uploadedUrl: null,
          uploadError: null,
          uploadProgress: null,
        })
      })
    })
  })

  it('should call onFileUrlChange when file changes', async () => {
    const { result } = renderHook(() =>
      useIpfsFilePicker({
        accept: 'image/*',
        onFileUrlChange: onFileUrlChangeMock,
      }),
    )
    await testFileAction(concreteOnFileChange)
    expect(onFileUrlChangeMock).toHaveBeenCalledWith(ipfsGatewayUrl('hash'))
    testCurrentState(result.current, {
      isUploading: false,
      uploadedUrl: ipfsGatewayUrl('hash'),
      uploadError: null,
      uploadProgress: null,
    })
    expect(onFileUrlChangeMock).toHaveBeenCalledTimes(1)
    expect(onFileUrlChangeMock).toHaveBeenCalledWith(ipfsGatewayUrl('hash'))
  })

  it.each(actionCases)(
    `should call onFileUrlChange when file is %s`,
    async action => {
      const { result } = renderHook(() =>
        useIpfsFilePicker({
          accept: 'image/*',
          onFileUrlChange: onFileUrlChangeMock,
        }),
      )

      await testFileAction((result.current as any)[action])
      expect(onFileUrlChangeMock).toHaveBeenCalledTimes(1)
      expect(onFileUrlChangeMock).toHaveBeenCalledWith(undefined)
    },
  )
})
