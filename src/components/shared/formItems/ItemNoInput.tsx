import { Form, FormItemProps, Input } from 'antd'

/**
 * Item used in a Form to allow an item with no input.
 */
export function ItemNoInput(props: FormItemProps) {
  return (
    <Form.Item {...props}>
      {/* Added a hidden input here because Form.Item needs 
      a child Input to work. */}
      <Input hidden type="string" autoComplete="off" />
    </Form.Item>
  )
}
