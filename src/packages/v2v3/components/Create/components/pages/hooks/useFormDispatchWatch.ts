import { ActionCreatorWithPayload } from '@reduxjs/toolkit'
import { FormInstance } from 'antd'
import { useWatch } from 'antd/lib/form/Form'
import isEqual from 'lodash/isEqual'
import { useEffect } from 'react'
import { useAppDispatch } from 'redux/hooks/useAppDispatch'

/**
 * Watches a form field and updates a redux state when it changes.
 */
export const useFormDispatchWatch = <
  FormValues extends Record<string, unknown>,
  FieldName extends keyof FormValues,
  Payload = FormValues[FieldName],
>({
  form,
  fieldName,
  ignoreUndefined,
  currentValue,
  dispatchFunction,
  formatter,
}: {
  form: FormInstance<FormValues>
  fieldName: FieldName
  ignoreUndefined?: boolean
  currentValue?: Payload
  dispatchFunction: ActionCreatorWithPayload<Payload>
  formatter: (v: FormValues[FieldName]) => Payload
}) => {
  const fieldValue = useWatch(fieldName, form)
  const dispatch = useAppDispatch()

  useEffect(() => {
    if (ignoreUndefined && fieldValue === undefined) return

    const v = formatter(fieldValue)
    if (isEqual(v, currentValue)) return

    dispatch(dispatchFunction(v))
  }, [
    currentValue,
    dispatch,
    dispatchFunction,
    fieldValue,
    formatter,
    ignoreUndefined,
  ])
}
