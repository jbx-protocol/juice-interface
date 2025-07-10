import { renderHook } from '@testing-library/react-hooks'
import { useCurrentUpcomingConfigurationPanel } from './useCurrentUpcomingConfigurationPanel'
import { useCycleSection } from './useCycleSection'
import { useOtherRulesSection } from './useOtherRulesSection'
import { useTokenSection } from './useTokenSection'

jest.mock('./useCycleSection', () => ({ useCycleSection: jest.fn() }))
jest.mock('./useTokenSection', () => ({ useTokenSection: jest.fn() }))
jest.mock('./useOtherRulesSection', () => ({ useOtherRulesSection: jest.fn() }))

describe('useCurrentUpcomingConfigurationPanel', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('calls child hooks with the correct type', () => {
    ;(useCycleSection as jest.Mock).mockReturnValue({ name: 'cycle' })
    ;(useTokenSection as jest.Mock).mockReturnValue({ name: 'token' })
    ;(useOtherRulesSection as jest.Mock).mockReturnValue({ name: 'otherRules' })

    const { result } = renderHook(() =>
      useCurrentUpcomingConfigurationPanel('current'),
    )

    expect(useCycleSection).toHaveBeenCalledWith('current')
    expect(useTokenSection).toHaveBeenCalledWith('current')
    expect(useOtherRulesSection).toHaveBeenCalledWith('current')

    expect(result.current.cycle).toEqual({ name: 'cycle' })
    expect(result.current.token).toEqual({ name: 'token' })
    expect(result.current.otherRules).toEqual({ name: 'otherRules' })
  })
})
