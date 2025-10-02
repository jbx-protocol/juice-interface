import { isAddress } from 'ethers/lib/utils'
import { useWallet } from 'hooks/Wallet'
import { resolveAddress } from 'lib/api/ens'
import { useCallback, useReducer } from 'react'
import { editRewardBeneficiaryReducer } from './editRewardBeneficiaryReducer'

const isENS = (address = '') => address.endsWith('.eth')

export const useEditRewardBeneficiary = (
  _value: string | undefined,
  onChange: ((value: string) => void) | undefined,
) => {
  const { userAddress } = useWallet()
  const address = _value || userAddress

  const [state, dispatch] = useReducer(editRewardBeneficiaryReducer, {
    isEditing: false,
    isLoading: false,
    address,
  })

  const handleFinishedEditing = useCallback(
    (newAddress: string) => {
      dispatch({ type: 'save', address: newAddress })
      onChange?.(newAddress)
    },
    [onChange],
  )

  const editClicked = useCallback(() => {
    dispatch({ type: 'edit' })
  }, [])

  const handleInputChanged: React.ChangeEventHandler<HTMLInputElement> =
    useCallback(
      async e => {
        dispatch({ type: 'edit' })
        const value = e.target.value
        if (isENS(value)) {
          dispatch({ type: 'loading' })
          try {
            const { address: addressForEnsName } = await resolveAddress(value)
            if (addressForEnsName) {
              return handleFinishedEditing(addressForEnsName)
            }
            dispatch({ type: 'error', error: 'No address found for ENS name' })
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
          } catch (e: any) {
            console.error(e)
            dispatch({ type: 'error', error: e.message })
          }
        }
        if (isAddress(value)) {
          return handleFinishedEditing(value)
        }
      },
      [handleFinishedEditing],
    )

  const handleInputBlur = useCallback(() => {
    dispatch({ type: 'cancel' })
  }, [])

  return {
    ...state,
    editClicked,
    handleInputChanged,
    handleInputBlur,
  }
}
