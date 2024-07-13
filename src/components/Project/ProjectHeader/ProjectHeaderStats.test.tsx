/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import { BigNumber } from 'ethers'
import { useProjectPageQueries } from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectPageQueries'
import {
  ProjectHeaderData,
  useV2V3ProjectHeader,
} from 'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useV2V3ProjectHeader'
import { ProjectHeaderStats } from './ProjectHeaderStats'

jest.mock(
  'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useV2V3ProjectHeader',
)
jest.mock(
  'packages/v2v3/components/V2V3Project/ProjectDashboard/hooks/useProjectPageQueries',
)

function mockUseV2V3ProjectHeader(data: ProjectHeaderData) {
  ;(useV2V3ProjectHeader as jest.Mock).mockReturnValue(data)
}

function mockUseProjectPageQueries() {
  ;(useProjectPageQueries as jest.Mock).mockReturnValue({
    setProjectPageTab: jest.fn(),
  })
}

const MOCK_PROJECT_HEADER_DATA: ProjectHeaderData = {
  domain: 'juicebox',
  title: 'bongdao',
  subtitle: { text: 'big rips', type: 'tagline' },
  handle: 'bongdao',
  projectId: 420,
  owner: '0x1234',
  payments: 420,
  totalVolume: BigNumber.from(420),
  last7DaysPercent: 69,
  gnosisSafe: undefined,
  archived: false,
  createdAtSeconds: 420,
}

describe('ProjectHeaderStats', () => {
  beforeEach(() => {
    mockUseProjectPageQueries()
  })
  it.each`
    last7DaysPercent | shouldRender
    ${0}             | ${true}
    ${Infinity}      | ${false}
    ${69}            | ${true}
  `(
    'renders the ProjectHeaderStats component with last7DaysPercent = %last7DaysPercent',
    ({ last7DaysPercent, shouldRender }) => {
      mockUseV2V3ProjectHeader({
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
