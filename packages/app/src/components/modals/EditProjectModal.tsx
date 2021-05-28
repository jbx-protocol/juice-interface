import { BigNumber } from '@ethersproject/bignumber'
import { Form, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'
import { UserContext } from 'contexts/userContext'
import { ProjectMetadata } from 'models/project-metadata'
import { useContext, useEffect, useState } from 'react'
import {
  cidFromUrl,
  editMetadataForCid,
  logoNameForHandle,
  metadataNameForHandle,
  unpinFileByName,
  uploadProjectMetadata,
} from 'utils/ipfs'

export type EditProjectFormFields = {
  name: string
  infoUrl: string
  // handle: string
  logoUrl: string
}

// TODO edit handle
export default function EditProjectModal({
  handle,
  metadata,
  projectId,
  visible,
  onSuccess,
  onCancel,
}: {
  handle: string
  metadata: ProjectMetadata
  projectId: BigNumber
  visible?: boolean
  onSuccess?: VoidFunction
  onCancel?: VoidFunction
}) {
  const { transactor, contracts } = useContext(UserContext)
  const [loading, setLoading] = useState<boolean>()
  const [form] = useForm<EditProjectFormFields>()

  useEffect(() => {
    if (!metadata) return

    form.setFieldsValue({
      name: metadata?.name,
      // handle: handle,
      infoUrl: metadata?.infoUri,
      logoUrl: metadata?.logoUri,
    })
  }, [
    // handle,
    form,
    metadata,
  ])

  async function setUri() {
    if (!transactor || !contracts?.Juicer) return
    // if (!transactor || !contracts?.Juicer || !handle) return

    setLoading(true)

    const fields = form.getFieldsValue(true)

    const uploadedMetadata = await uploadProjectMetadata({
      name: fields.name,
      logoUri: fields.logoUrl,
      infoUri: fields.infoUrl,
    })

    if (!uploadedMetadata?.success) {
      setLoading(false)
      return
    }

    transactor(
      contracts.Projects,
      'setUri',
      [
        projectId.toString(),
        // fields.handle,
        uploadedMetadata.cid,
      ],
      {
        onDone: () => setLoading(false),
        onConfirmed: () => {
          if (onSuccess) onSuccess()

          // Remove previous metadata file
          unpinFileByName(metadataNameForHandle(handle))

          // Set name for new metadata file
          editMetadataForCid(uploadedMetadata.cid, {
            name: metadataNameForHandle(handle),
          })

          // If logo changed
          if (metadata?.logoUri !== fields.logoUrl) {
            // Remove previous logo file
            unpinFileByName(logoNameForHandle(handle))

            // Set name for new logo file
            editMetadataForCid(cidFromUrl(fields.logoUrl), {
              name: logoNameForHandle(handle),
            })
          }
        },
      },
    )
  }

  return (
    <Modal
      title="Edit project"
      visible={visible}
      okText="Save changes"
      onOk={setUri}
      onCancel={onCancel}
      confirmLoading={loading}
      width={600}
    >
      <Form form={form} layout="vertical">
        <FormItems.ProjectName
          name="name"
          formItemProps={{ rules: [{ required: true }] }}
        />
        {/* <FormItems.ProjectHandle
          name="handle"
          value={form.getFieldValue('handle')}
          onValueChange={val => form.setFieldsValue({ handle: val })}
          formItemProps={{ rules: [{ required: true }] }}
        /> */}
        <FormItems.ProjectLink name="infoUrl" />
        <FormItems.ProjectLogoUrl
          name="logoUrl"
          initialUrl={form.getFieldValue('logoUrl')}
          onSuccess={logoUrl => form.setFieldsValue({ logoUrl })}
        />
      </Form>
    </Modal>
  )
}
