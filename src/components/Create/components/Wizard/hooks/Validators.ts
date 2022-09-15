import { useCallback, useReducer } from 'react'
import { AnyPromiseFn } from 'utils/types'
import { v4 } from 'uuid'

interface ValidatorAction {
  type: 'add' | 'remove'
}
interface ValidatorAddAction extends ValidatorAction {
  type: 'add'
  item: { id: string; validator: AnyPromiseFn }
}
interface ValidatorRemoveAction extends ValidatorAction {
  type: 'remove'
  id: string
}

const validatorReducer = (
  state: { id: string; validator: AnyPromiseFn }[],
  action: ValidatorAddAction | ValidatorRemoveAction,
) => {
  let newState
  switch (action.type) {
    case 'add': {
      newState = [...state, action.item]
      break
    }
    case 'remove': {
      newState = state.filter(({ id }) => id === action.id)
      break
    }
    default:
      throw new Error('invalid state')
  }
  return newState
}

export const useValidators = () => {
  const [validators, dispatch] = useReducer(validatorReducer, [])

  const addValidator = useCallback((validator: AnyPromiseFn) => {
    const id = v4()
    dispatch({ type: 'add', item: { id, validator } })
    return id
  }, [])

  const removeValidator = useCallback(
    (id: string) => dispatch({ type: 'remove', id }),
    [],
  )

  return { validators, addValidator, removeValidator }
}
