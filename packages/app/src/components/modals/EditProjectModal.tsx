import { BigNumber } from '@ethersproject/bignumber'
import { Form, Input, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { UserContext } from 'contexts/userContext'
import { ProjectIdentifier } from 'models/projectIdentifier'
import React, { useContext, useEffect, useState } from 'react'

export type EditProjectFormFields = {
  name: string
  link: string
  handle: string
  logoUri: string
}

export default function EditProjectModal({
  project,
  projectId,
  visible,
  onSuccess,
  onCancel,
}: {
  project: ProjectIdentifier | undefined
  projectId: BigNumber
  visible?: boolean
  onSuccess?: VoidFunction
  onCancel?: VoidFunction
}) {
  const { transactor, contracts } = useContext(UserContext)
  const [loading, setLoading] = useState<boolean>()
  const [form] = useForm<EditProjectFormFields>()

  useEffect(() => {
    if (!project) return

    form.setFieldsValue({
      name: project.name,
      handle: project.handle,
      link: project.link,
      logoUri: project.logoUri,
    })
  }, [project])

  async function setIdentifiers() {
    if (!transactor || !contracts?.Juicer || !project) return

    setLoading(true)

    const fields = form.getFieldsValue(true)

    transactor(
      contracts.Projects,
      'setIdentifiers',
      [
        projectId.toString(),
        fields.name,
        fields.handle,
        fields.logoUri,
        fields.link,
      ],
      {
        onDone: () => setLoading(false),
        onConfirmed: () => {
          if (onSuccess) onSuccess()
        },
      },
    )
  }

  return (
    <Modal
      title="Edit project"
      visible={visible}
      okText="Save changes"
      onOk={setIdentifiers}
      onCancel={onCancel}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          extra="How your project is identified on-chain"
          name="name"
          label="Name"
          rules={[{ required: true }]}
        >
          <Input
            className="align-end"
            placeholder="Peach's Juice Stand"
            type="string"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item label="Handle" name="handle" rules={[{ required: true }]}>
          <Input
            prefix="@"
            placeholder="yourProject"
            type="string"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          name="link"
          label="Link"
          extra="Add a URL that points to where someone could find more information about
        your project. (optional)"
        >
          <Input
            placeholder="http://your-project.com"
            type="string"
            autoComplete="off"
          />
        </Form.Item>
        {/* TODO */}
        {/* <Form.Item name="logoUri">
          <Input
            className="align-end"
            placeholder="http://your-project.com"
            type="string"
            autoComplete="off"
          />
        </Form.Item> */}
      </Form>
    </Modal>
  )
}
