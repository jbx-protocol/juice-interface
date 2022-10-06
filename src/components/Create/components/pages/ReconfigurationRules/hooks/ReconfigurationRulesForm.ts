import { Form } from 'antd'

export interface ReconfigurationRulesFormProps {
  selection: 'threeDay' | 'sevenDay' | 'custom' | 'none'
}

export const useReconfigurationRulesForm = () => {
  const [form] = Form.useForm<ReconfigurationRulesFormProps>()
  const initialValues = undefined
  return { form, initialValues }
}
