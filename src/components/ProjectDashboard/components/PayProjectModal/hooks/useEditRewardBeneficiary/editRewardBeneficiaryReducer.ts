type EditRewardBeneficiaryReducerState = {
  isEditing: boolean
  isLoading: boolean
  address?: string
  error?: string
}

type EditRewardBeneficiaryReducerAction =
  | {
      type: 'edit'
    }
  | {
      type: 'cancel'
    }
  | {
      type: 'loading'
    }
  | {
      type: 'save'
      address: string | undefined
    }
  | {
      type: 'error'
      error: string
    }

export const editRewardBeneficiaryReducer = (
  state: EditRewardBeneficiaryReducerState,
  action: EditRewardBeneficiaryReducerAction,
): EditRewardBeneficiaryReducerState => {
  switch (action.type) {
    case 'edit':
      return {
        ...state,
        isEditing: true,
        isLoading: false,
        error: undefined,
      }
    case 'cancel':
      return {
        ...state,
        isEditing: false,
        isLoading: false,
        error: undefined,
      }
    case 'save':
      return {
        ...state,
        isEditing: false,
        isLoading: false,
        error: undefined,
        address: action.address,
      }
    case 'loading':
      return {
        ...state,
        isLoading: true,
        error: undefined,
      }
    case 'error':
      return {
        ...state,
        error: action.error,
        isLoading: false,
      }
    default:
      return state
  }
}
