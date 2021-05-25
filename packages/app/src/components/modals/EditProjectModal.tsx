import { BigNumber } from '@ethersproject/bignumber'
import { Form, Input, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { UserContext } from 'contexts/userContext'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { ProjectIdentifier } from 'models/project-identifier'
import { useContext, useEffect, useState } from 'react'

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
  const metadata = useProjectMetadata(project?.link)

  // TODO update edit project with new logo/metadata uploading pattern

  useEffect(() => {
    if (!project) return

    form.setFieldsValue({
      name: metadata?.name,
      handle: project.handle,
      link: metadata?.infoUri,
      logoUri: metadata?.logoUri,
    })
  }, [project, form])

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
          label="Link (optional)"
          extra="Add a URL that points to where someone could find more information about
        your project."
        >
          <Input
            placeholder="http://your-project.com"
            type="string"
            autoComplete="off"
          />
        </Form.Item>
        <Form.Item
          name="logoUri"
          label="Logo URL (optional)"
          extra="The URL of your logo hosted somewhere on the internet."
        >
          <Input
            placeholder="http://ipfs.your-host.io/your-logo.jpg"
            type="string"
            autoComplete="off"
          />
        </Form.Item>
      </Form>
    </Modal>
  )
}
