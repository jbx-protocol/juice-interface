import { payProjectModalReducer } from './payProjectModalReducer'

describe('payProjectModalReducer', () => {
  const DefaultPayProjectModalState = {
    isTransactionPending: false,
    isTransactionConfirmed: false,
    transactionError: undefined,
  }

  it.each`
    actionType                | expectedIsTransactionPending | expectedIsTransactionConfirmed | expectedTransactionError
    ${'transactionPending'}   | ${true}                      | ${false}                       | ${undefined}
    ${'transactionConfirmed'} | ${false}                     | ${true}                        | ${undefined}
    ${'transactionError'}     | ${false}                     | ${false}                       | ${'error'}
    ${'reset'}                | ${false}                     | ${false}                       | ${undefined}
  `(
    'returns isTransactionPending=$expectedIsTransactionPending, isTransactionConfirmed=$expectedIsTransactionConfirmed, and transactionError=$expectedTransactionError when actionType=$actionType',
    ({
      actionType,
      expectedIsTransactionPending,
      expectedIsTransactionConfirmed,
      expectedTransactionError,
    }) => {
      const action = { type: actionType, error: 'error' }
      const result = payProjectModalReducer(DefaultPayProjectModalState, action)
      expect(result.isTransactionPending).toBe(expectedIsTransactionPending)
      expect(result.isTransactionConfirmed).toBe(expectedIsTransactionConfirmed)
      expect(result.transactionError).toBe(expectedTransactionError)
    },
  )

  test('returns default state when actionType is not recognized', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const action = { type: 'unknown' } as any
    const result = payProjectModalReducer(DefaultPayProjectModalState, action)
    expect(result).toBe(DefaultPayProjectModalState)
  })
})
