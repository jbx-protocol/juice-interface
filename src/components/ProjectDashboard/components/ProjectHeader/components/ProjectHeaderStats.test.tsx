/**
 * @jest-environment jsdom
 */
import { render } from '@testing-library/react'
import {
  ProjectHeaderData,
  useProjectHeader,
} from 'components/ProjectDashboard/hooks'
import { BigNumber } from 'ethers'
import { ProjectHeaderStats } from './ProjectHeaderStats'

jest.mock('components/ProjectDashboard/hooks')

function mockUseProjectHeader(data: ProjectHeaderData) {
  ;(useProjectHeader as jest.Mock).mockReturnValue(data)
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
}

describe('ProjectHeaderStats', () => {
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
