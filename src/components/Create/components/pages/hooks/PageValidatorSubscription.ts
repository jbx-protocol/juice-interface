import { useContext, useEffect, useRef } from 'react'
import { AnyPromiseFn } from 'utils/types'
import { PageContext } from '../../Wizard/contexts/PageContext'

/**
 * Add to a Wizard.Page to subscribe the page to validation changes.
 *
 * Automatically unsubscribes when component is unmounted.
 */
export const usePageValidatorSubscription = (validator: AnyPromiseFn) => {
  const { addValidator, removeValidator } = useContext(PageContext)
  const hasAlreadySubscribed = useRef(false)

  return useEffect(() => {
    if (!addValidator || !removeValidator || hasAlreadySubscribed.current) {
      return
    }
    const id = addValidator(validator)
    hasAlreadySubscribed.current = true
    return () => removeValidator(id)
  }, [addValidator, removeValidator, validator])
}
