type PayProjectModalState = {
  isTransactionPending: boolean
  isTransactionConfirmed: boolean
  transactionError: string | undefined
}
type PayProjectModalAction =
  | { type: 'transactionPending' }
  | { type: 'transactionConfirmed' }
  | { type: 'transactionError'; error: string }
  | { type: 'reset' }

export const payProjectModalReducer = (
  state: PayProjectModalState,
  action: PayProjectModalAction,
): PayProjectModalState => {
  switch (action.type) {
    case 'transactionPending':
      return {
        ...state,
        isTransactionPending: true,
        isTransactionConfirmed: false,
        transactionError: undefined,
      }
    case 'transactionConfirmed':
      return {
        ...state,
        isTransactionPending: false,
        isTransactionConfirmed: true,
        transactionError: undefined,
      }
    case 'transactionError':
      return {
        ...state,
        isTransactionPending: false,
        isTransactionConfirmed: false,
        transactionError: action.error,
      }
    case 'reset':
      return {
        ...state,
        isTransactionPending: false,
        isTransactionConfirmed: false,
        transactionError: undefined,
      }
    default:
      return state
  }
}
