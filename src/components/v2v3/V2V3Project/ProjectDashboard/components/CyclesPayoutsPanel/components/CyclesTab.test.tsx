/**
 * @jest-environment jsdom
 */
import { Tab } from '@headlessui/react'
import { render } from '@testing-library/react'
import { CyclesTab } from './CyclesTab'

const wrapper = ({ children }: { children?: React.ReactNode }) => (
  <Tab.Group>{children}</Tab.Group>
)

describe('src/components/v2v3/V2V3Project/ProjectDashboard/components/CyclesPayoutsPanel/components/CyclesTab.tsx', () => {
  it('should match snapshot', () => {
    const { baseElement } = render(<CyclesTab name="name" />, { wrapper })
    expect(baseElement).toMatchSnapshot()
  })

  it('should have correct text', () => {
    const { getByText } = render(<CyclesTab name="name" />, { wrapper })
    expect(getByText('name')).toBeInTheDocument()
  })
})
