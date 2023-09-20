/**
 * @jest-environment jsdom
 */

import { render, screen } from '@testing-library/react'
import { ProjectAllocationRow } from './ProjectAllocationRow'

jest.mock('components/JuiceboxAccountLink', () => ({
  JuiceboxAccountLink: jest
    .fn()
    .mockImplementation(() => (
      <div data-testid="JuiceboxAccountLink">Mock JuiceboxAccountLink</div>
    )),
}))

jest.mock('components/v2v3/shared/V2V3ProjectHandleLink', () => ({
  __esModule: true,
  default: jest
    .fn()
    .mockImplementation(() => (
      <div data-testid="V2V3ProjectHandleLink">Mock V2V3ProjectHandleLink</div>
    )),
}))

describe('ProjectAllocationRow', () => {
  it('renders a JuiceboxAccountLink if no projectId', () => {
    const { getByTestId } = render(
      <ProjectAllocationRow
        address="0x123"
        projectId={undefined}
        percent="100%"
      />,
    )
    expect(getByTestId('JuiceboxAccountLink')).toBeInTheDocument()
    const JuiceboxAccountLink = screen.queryByTestId('V2V3ProjectHandleLink')
    expect(JuiceboxAccountLink).not.toBeInTheDocument()
  })

  it('renders a V2V3ProjectHandleLink if projectId', () => {
    const { getByTestId } = render(
      <ProjectAllocationRow address="0x123" projectId={1} percent="100%" />,
    )
    expect(getByTestId('V2V3ProjectHandleLink')).toBeInTheDocument()
    const V2V3ProjectHandleLink = screen.queryByTestId('JuiceboxAccountLink')
    expect(V2V3ProjectHandleLink).not.toBeInTheDocument()
  })
})
