import { editRewardBeneficiaryReducer } from './editRewardBeneficiaryReducer'

describe('editRewardBeneficiaryReducer', () => {
  const DEFAULT_INITIAL_STATE = {
    isEditing: false,
    isLoading: false,
    error: undefined,
  }
  test.each`
    state                    | action                                        | expected
    ${DEFAULT_INITIAL_STATE} | ${{ type: 'edit' }}                           | ${{ isEditing: true, isLoading: false, error: undefined }}
    ${DEFAULT_INITIAL_STATE} | ${{ type: 'cancel' }}                         | ${{ isEditing: false, isLoading: false, error: undefined }}
    ${DEFAULT_INITIAL_STATE} | ${{ type: 'loading' }}                        | ${{ isEditing: false, isLoading: true, error: undefined }}
    ${DEFAULT_INITIAL_STATE} | ${{ type: 'save', address: '0x000' }}         | ${{ isEditing: false, isLoading: false, error: undefined, address: '0x000' }}
    ${DEFAULT_INITIAL_STATE} | ${{ type: 'save', address: undefined }}       | ${{ isEditing: false, isLoading: false, error: undefined, address: undefined }}
    ${DEFAULT_INITIAL_STATE} | ${{ type: 'error', error: 'error occurred' }} | ${{ isEditing: false, isLoading: false, error: 'error occurred' }}
  `(
    'should return $expected when $action is dispatched',
    ({ state, action, expected }) => {
      expect(editRewardBeneficiaryReducer(state, action)).toEqual(expected)
    },
  )
})
