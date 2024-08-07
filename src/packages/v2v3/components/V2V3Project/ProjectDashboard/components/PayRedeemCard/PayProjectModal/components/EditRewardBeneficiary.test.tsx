/**
 * @jest-environment jsdom
 */
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { useEditRewardBeneficiary } from '../hooks/useEditRewardBeneficiary/useEditRewardBeneficiary'
import { EditRewardBeneficiary } from './EditRewardBeneficiary'

jest.mock('../hooks/useEditRewardBeneficiary/useEditRewardBeneficiary')
jest.mock('components/EthereumAddress')

describe('EditRewardBeneficiary', () => {
  const DEFAULT_USE_EDIT_REWARD_BENEFICIARY = {
    address: '0x123',
    isEditing: false,
    isLoading: false,
    error: null,
    editClicked: jest.fn(),
    handleInputChanged: jest.fn(),
    handleInputBlur: jest.fn(),
  }
  beforeEach(() => {
    ;(useEditRewardBeneficiary as jest.Mock).mockReturnValue(
      DEFAULT_USE_EDIT_REWARD_BENEFICIARY,
    )
    DEFAULT_USE_EDIT_REWARD_BENEFICIARY.editClicked.mockClear()
    DEFAULT_USE_EDIT_REWARD_BENEFICIARY.handleInputChanged.mockClear()
    DEFAULT_USE_EDIT_REWARD_BENEFICIARY.handleInputBlur.mockClear()
  })

  it('foo', () => {
    expect(true).toBe(true)
  })

  it('should render', () => {
    const { container } = render(<EditRewardBeneficiary />)
    expect(container).toMatchSnapshot()
  })

  it('renders with user address', () => {
    render(<EditRewardBeneficiary />)
    expect(screen.getByText('0x123')).toBeInTheDocument()
  })

  it('changes to a text input when edit clicked', () => {
    render(<EditRewardBeneficiary />)
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    waitFor(() => {
      expect(screen.getByRole('textbox')).toBeInTheDocument()
      expect(screen.getByRole('textbox')).toHaveFocus()
    })
  })

  it('changes back to address when blurred', () => {
    render(<EditRewardBeneficiary />)
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    waitFor(() => {
      fireEvent.blur(screen.getByRole('textbox'))
    })
    waitFor(() => {
      expect(screen.getByText('0x123')).toBeInTheDocument()
    })
  })

  it('calls handleInputChanged when input changed', () => {
    render(<EditRewardBeneficiary />)
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }))
    waitFor(() => {
      fireEvent.change(screen.getByRole('textbox'), {
        target: { value: '0x123' },
      })
    })
    waitFor(() => {
      expect(
        DEFAULT_USE_EDIT_REWARD_BENEFICIARY.handleInputChanged,
      ).toHaveBeenCalled()
    })
  })
})
