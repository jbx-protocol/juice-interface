/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import {
  ProjectHeaderData,
  useProjectHeader,
} from 'components/ProjectDashboard/hooks'
import { useProjectPageQueries } from 'components/ProjectDashboard/hooks/useProjectPageQueries'
import { BigNumber } from 'ethers'
import { ProjectHeaderStats } from './ProjectHeaderStats'

jest.mock('components/ProjectDashboard/hooks')
jest.mock('components/ProjectDashboard/hooks/useProjectPageQueries')

function mockUseProjectHeader(data: ProjectHeaderData) {
  ;(useProjectHeader as jest.Mock).mockReturnValue(data)
}

function mockUseProjectPageQueries() {
  ;(useProjectPageQueries as jest.Mock).mockReturnValue({
    setProjectPageTab: jest.fn(),
  })
}

const MOCK_PROJECT_HEADER_DATA: ProjectHeaderData = {
  title: 'bongdao',
  subtitle: 'big rips',
  handle: 'bongdao',
  projectId: 420,
  owner: '0x1234',
  payments: 420,
  totalVolume: BigNumber.from(420),
  last7DaysPercent: 69,
  gnosisSafe: undefined,
}

describe('ProjectHeaderStats', () => {
  beforeEach(() => {
    mockUseProjectPageQueries()
  })
  it.each`
    last7DaysPercent | shouldRender
    ${0}             | ${false}
    ${Infinity}      | ${false}
    ${69}            | ${true}
  `(
    'renders the ProjectHeaderStats component with last7DaysPercent = %last7DaysPercent',
    ({ last7DaysPercent, shouldRender }) => {
      mockUseProjectHeader({
        ...MOCK_PROJECT_HEADER_DATA,
        last7DaysPercent,
      })

      const { queryByTestId } = render(<ProjectHeaderStats />)

      const trendingStat = queryByTestId('project-header-trending-perc')
      if (!shouldRender) {
        expect(trendingStat).not.toBeInTheDocument()
      } else {
        expect(trendingStat).toHaveTextContent(last7DaysPercent)
      }
    },
  )
})
