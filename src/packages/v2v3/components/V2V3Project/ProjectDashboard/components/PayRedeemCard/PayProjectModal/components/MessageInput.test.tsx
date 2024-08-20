/**
 * @jest-environment jsdom
 */

/* eslint-disable @typescript-eslint/no-empty-function */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { render, screen } from '@testing-library/react'
import { Formik } from 'formik'
import { useIpfsFilePicker } from 'hooks/useIpfsFilePicker/useIpfsFilePicker'
import { MessageInput } from './MessageInput'

jest.mock('hooks/useIpfsFilePicker/useIpfsFilePicker')

jest.mock('components/JuiceVideo/JuiceVideoThumbnailOrImage', () => ({
  JuiceVideoThumbnailOrImage: ({ src, alt }: any) => (
    <img src={src} alt={alt} />
  ),
}))

describe('MessageInput', () => {
  const DefaultUseIpfsFilePicker = {
    selectedFile: null,
    FileInput: null,
    openFilePicker: jest.fn(),
    removeFile: jest.fn(),
    cancelUpload: jest.fn(),
    isUploading: false,
    uploadedUrl: '',
    uploadError: '',
    uploadProgress: 0,
  }
  const DefaultInput = {
    className: '',
    value: {
      messageString: '',
      attachedUrl: '',
    },
    onChange: () => {},
  }
  const TestWrapper = ({ children }: any) => {
    return (
      <Formik initialValues={{ message: '' }} onSubmit={() => {}}>
        {children}
      </Formik>
    )
  }

  beforeEach(() => {
    ;(useIpfsFilePicker as jest.Mock).mockReturnValue(DefaultUseIpfsFilePicker)
    DefaultUseIpfsFilePicker.openFilePicker.mockClear()
    DefaultUseIpfsFilePicker.removeFile.mockClear()
    DefaultUseIpfsFilePicker.cancelUpload.mockClear()
  })

  it('renders with placeholder and add image button', () => {
    render(
      <TestWrapper>
        <MessageInput {...DefaultInput} placeholder="test" />
      </TestWrapper>,
    )
    expect(screen.getByPlaceholderText('test')).toBeInTheDocument()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('renders input with value', () => {
    render(
      <TestWrapper>
        <MessageInput
          {...DefaultInput}
          value={{ messageString: 'test', attachedUrl: '' }}
        />
      </TestWrapper>,
    )
    expect(screen.getByDisplayValue('test')).toBeInTheDocument()
  })

  it('renders input with value and image', () => {
    ;(useIpfsFilePicker as jest.Mock).mockReturnValue({
      ...DefaultUseIpfsFilePicker,
      selectedFile: new File([''], 'filename'),
      uploadedUrl: 'test',
    })
    render(
      <TestWrapper>
        <MessageInput
          {...DefaultInput}
          value={{ messageString: 'test', attachedUrl: 'test' }}
        />
      </TestWrapper>,
    )
    expect(screen.getByDisplayValue('test')).toBeInTheDocument()
    expect(screen.getByRole('img')).toBeInTheDocument()
  })

  it('renders upload progress while uploading', () => {
    ;(useIpfsFilePicker as jest.Mock).mockReturnValue({
      ...DefaultUseIpfsFilePicker,
      isUploading: true,
      uploadProgress: 50,
    })
    render(
      <TestWrapper>
        <MessageInput {...DefaultInput} />
      </TestWrapper>,
    )
    expect(screen.getByRole('progressbar')).toBeInTheDocument()
  })

  it('calls openFilePicker on button click', () => {
    render(
      <TestWrapper>
        <MessageInput {...DefaultInput} />
      </TestWrapper>,
    )
    screen.getByRole('button').click()
    expect(DefaultUseIpfsFilePicker.openFilePicker).toHaveBeenCalledTimes(1)
  })

  it('calls removeFile on remove button click', () => {
    ;(useIpfsFilePicker as jest.Mock).mockReturnValue({
      ...DefaultUseIpfsFilePicker,
      selectedFile: new File([''], 'filename'),
      uploadedUrl: 'test',
    })
    render(
      <TestWrapper>
        <MessageInput {...DefaultInput} />
      </TestWrapper>,
    )
    screen.getByRole('button', { name: 'Remove attached file' }).click()
    expect(DefaultUseIpfsFilePicker.removeFile).toHaveBeenCalledTimes(1)
  })

  it('calls cancelUpload on cancel button click', () => {
    ;(useIpfsFilePicker as jest.Mock).mockReturnValue({
      ...DefaultUseIpfsFilePicker,
      isUploading: true,
      uploadProgress: 50,
    })
    render(
      <TestWrapper>
        <MessageInput {...DefaultInput} />
      </TestWrapper>,
    )
    screen.getByRole('button', { name: 'Cancel upload' }).click()
    expect(DefaultUseIpfsFilePicker.cancelUpload).toHaveBeenCalledTimes(1)
  })

  test('upload button is disabled when uploading', () => {
    ;(useIpfsFilePicker as jest.Mock).mockReturnValue({
      ...DefaultUseIpfsFilePicker,
      isUploading: true,
      uploadProgress: 50,
    })
    render(
      <TestWrapper>
        <MessageInput {...DefaultInput} />
      </TestWrapper>,
    )
    expect(
      screen.getByRole('button', { name: 'Attach an image' }),
    ).toBeDisabled()
  })
})
