import { Form } from 'antd'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useDebugValue, useEffect, useMemo } from 'react'

export type ProjectTokensFormProps = Partial<{
  selection: 'default' | 'custom'
}>

export const useProjectTokensForm = () => {
  const [form] = Form.useForm<ProjectTokensFormProps>()

  useDebugValue(form.getFieldsValue())

  const initialValues: ProjectTokensFormProps | undefined = useMemo(() => {
    return undefined
  }, [])

  const dispatch = useAppDispatch()

  useEffect(() => {
    dispatch
  }, [dispatch])

  return { form, initialValues }
}
