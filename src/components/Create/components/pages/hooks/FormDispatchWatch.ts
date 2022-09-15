import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { FormInstance } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useEffect } from 'react'

/**
 * Watches a form field and updates a redux state when it changes.
 */
export const useFormDispatchWatch = <
  Payload,
  FormValues extends Record<string, unknown>,
>({
  form,
  fieldName,
  dispatchFunction,
  formatter,
}: {
  form: FormInstance<FormValues>
  fieldName: keyof FormValues
  dispatchFunction: ActionCreatorWithPayload<Payload>
  formatter: (v: FormValues[keyof FormValues]) => Payload
}) => {
  const fieldValue = useWatch(fieldName, form)
  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch(dispatchFunction(formatter(fieldValue)))
  }, [dispatch, dispatchFunction, fieldValue, formatter])
}
