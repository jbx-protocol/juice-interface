import { Form } from 'antd'
import { ReconfigurationStrategy } from 'models/reconfigurationStrategy'

export interface ReconfigurationRulesFormProps {
  selection: ReconfigurationStrategy
}

export const useReconfigurationRulesForm = () => {
  const [form] = Form.useForm<ReconfigurationRulesFormProps>()
  const initialValues = undefined
  return { form, initialValues }
}
