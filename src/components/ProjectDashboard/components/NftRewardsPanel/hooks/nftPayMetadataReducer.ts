export const ACTIONS = {
  SELECT_TIER: 'select_tier',
  DESELECT_TIER: 'deselect_tier',
}

interface State {
  tierIdsToMint: number[]
}

interface Action {
  type: string
  tierId?: number
  quantity?: number
}

export function nftPayMetadataReducer(state: State, action: Action): State {
  switch (action.type) {
    // Appends a given `quantity` of a given `tierId` to `tierIdsToMint`
    case ACTIONS.SELECT_TIER:
      return {
        tierIdsToMint: [
          ...state.tierIdsToMint,
          ...Array(action.quantity!).fill(action.tierId),
        ],
      }
    // Removes a given `quantity` of a given `tierId` from `tierIdsToMint`
    case ACTIONS.DESELECT_TIER: {
      let count = 0
      return {
        tierIdsToMint: state.tierIdsToMint.filter(id => {
          if (!action.quantity) {
            return id !== action.tierId
          }
          if (count < action.quantity && id === action.tierId) {
            count += 1
            return false
          }
          return true
        }),
      }
    }

    default:
      return state
  }
}
