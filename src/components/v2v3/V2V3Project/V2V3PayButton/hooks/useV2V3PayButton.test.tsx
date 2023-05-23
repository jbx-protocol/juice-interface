/* eslint-disable @typescript-eslint/no-explicit-any */
import { act, renderHook } from '@testing-library/react-hooks'
import {
  PayProjectFormContext,
  PayProjectFormContextType,
} from 'components/Project/PayProjectForm/payProjectFormContext'
import {
  ProjectMetadataContext,
  ProjectMetadataContextType,
} from 'contexts/shared/ProjectMetadataContext'
import {
  V2V3ProjectContext,
  V2V3ProjectContextType,
} from 'contexts/v2v3/Project/V2V3ProjectContext'
import { V2V3_CURRENCY_ETH } from 'utils/v2v3/currency'
import { useV2V3PayButton } from './useV2V3PayButton'

type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends Array<infer U>
    ? Array<DeepPartial<U>>
    : T[P] extends ReadonlyArray<infer U>
    ? ReadonlyArray<DeepPartial<U>>
    : T[P] extends object | undefined
    ? DeepPartial<T[P]>
    : T[P]
}

const withContextPropsWrapper = ({
  v2V3ProjectContext,
  projectMetadataContext,
  payProjectFormContext,
}: {
  v2V3ProjectContext?: DeepPartial<V2V3ProjectContextType>
  projectMetadataContext?: DeepPartial<ProjectMetadataContextType>
  payProjectFormContext?: DeepPartial<PayProjectFormContextType>
}) => {
  const ContextPropsWrapper = ({ children }: { children: React.ReactNode }) => {
    v2V3ProjectContext = v2V3ProjectContext ?? {
      fundingCycleMetadata: {
        pausePay: false,
      },
      loading: {
        primaryETHTerminalLoading: false,
        fundingCycleLoading: false,
      },
    }
    v2V3ProjectContext.loading = v2V3ProjectContext.loading ?? {
      primaryETHTerminalLoading: false,
      fundingCycleLoading: false,
    }
    projectMetadataContext = projectMetadataContext ?? {
      projectMetadata: {
        payButton: undefined,
      },
      isArchived: false,
    }

    payProjectFormContext = payProjectFormContext ?? {
      form: {
        payInCurrency: V2V3_CURRENCY_ETH,
        payAmount: '0',
      },
    }
    return (
      <V2V3ProjectContext.Provider value={v2V3ProjectContext as any}>
        <ProjectMetadataContext.Provider value={projectMetadataContext as any}>
          <PayProjectFormContext.Provider value={payProjectFormContext as any}>
            {children}
          </PayProjectFormContext.Provider>
        </ProjectMetadataContext.Provider>
      </V2V3ProjectContext.Provider>
    )
  }
  return ContextPropsWrapper
}

describe('useV2V3PayButton', () => {
  it.each([false, true])(
    'shows archived is %p when project context archived flag is %p',
    isArchived => {
      const wrapper = withContextPropsWrapper({
        projectMetadataContext: {
          isArchived,
        },
      })
      const { result } = renderHook(() => useV2V3PayButton(), { wrapper })

      expect(result.current.isArchived).toBe(isArchived)
    },
  )

  it.each([false, true])(
    'shows payIsPaused is %p when project context pausePay flag is %p',
    payIsPaused => {
      const wrapper = withContextPropsWrapper({
        v2V3ProjectContext: {
          fundingCycleMetadata: {
            pausePay: payIsPaused,
          },
        },
      })
      const { result } = renderHook(() => useV2V3PayButton(), { wrapper })

      expect(result.current.payIsPaused).toBe(payIsPaused)
    },
  )

  it('shows paymodal as closed when first initialised', () => {
    const wrapper = withContextPropsWrapper({})
    const { result } = renderHook(() => useV2V3PayButton(), { wrapper })

    expect(result.current.payModalVisible).toBe(false)
  })

  it('shows paymodal as visible when onPayClick', () => {
    const wrapper = withContextPropsWrapper({})
    const { result } = renderHook(() => useV2V3PayButton(), { wrapper })

    act(() => {
      result.current.onPayClick()
    })

    expect(result.current.payModalVisible).toBe(true)
  })

  it('shows paymodal as closed when onPayCancel', () => {
    const wrapper = withContextPropsWrapper({})
    const { result } = renderHook(() => useV2V3PayButton(), { wrapper })

    act(() => {
      result.current.onPayClick()
    })

    expect(result.current.payModalVisible).toBe(true)

    act(() => {
      result.current.onPayCancel()
    })

    expect(result.current.payModalVisible).toBe(false)
  })

  it.each(['', undefined])(
    'returns undefined when projectMetadata payButton is %p',
    payButton => {
      const wrapper = withContextPropsWrapper({
        projectMetadataContext: {
          projectMetadata: {
            payButton,
          },
        },
      })
      const { result } = renderHook(() => useV2V3PayButton(), { wrapper })

      expect(result.current.customPayButtonText).toBeUndefined()
    },
  )

  it('shows customPayButtonText when projectMetadata payButton is set', () => {
    const customPayButtonText = 'customPayButtonText'
    const wrapper = withContextPropsWrapper({
      projectMetadataContext: {
        projectMetadata: {
          payButton: customPayButtonText,
        },
      },
    })
    const { result } = renderHook(() => useV2V3PayButton(), { wrapper })

    expect(result.current.customPayButtonText).toBe(customPayButtonText)
  })

  it('shows payInCurrency from PayProjectFormContext.form', () => {
    const payInCurrency = V2V3_CURRENCY_ETH
    const wrapper = withContextPropsWrapper({
      payProjectFormContext: {
        form: {
          payInCurrency,
        },
      },
    })
    const { result } = renderHook(() => useV2V3PayButton(), { wrapper })

    expect(result.current.payInCurrency).toBe(payInCurrency)
  })

  it.each<'fundingCycleLoading' | 'primaryETHTerminalLoading'>([
    'fundingCycleLoading',
    'primaryETHTerminalLoading',
  ])('shows %p from loading', loadingKey => {
    const wrapper = withContextPropsWrapper({
      v2V3ProjectContext: {
        loading: {
          [loadingKey]: true,
        },
      },
    })
    const { result } = renderHook(() => useV2V3PayButton(), { wrapper })

    expect(result.current[loadingKey]).toBe(true)
  })
})
