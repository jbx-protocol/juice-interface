import { Form } from 'antd'

export const useNftRewardsForm = () => {
  const [form] = Form.useForm()
  const initialValues = undefined
  return { form, initialValues }
}
