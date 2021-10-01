import { BigNumber } from '@ethersproject/bignumber'
import { Button, Divider, Form, Input, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'
import { UserContext } from 'contexts/userContext'
import { utils } from 'ethers'
import { ProjectMetadata } from 'models/project-metadata'
import { useContext, useEffect, useState } from 'react'
import {
  cidFromUrl,
  editMetadataForCid,
  logoNameForHandle,
  metadataNameForHandle,
  uploadProjectMetadata,
} from 'utils/ipfs'

export type ProjectInfoFormFields = {
  name: string
  description: string
  infoUrl: string
  logoUrl: string
  payText: string
  version: number
}

export type HandleFormFields = {
  handle: string
}

export default function EditProjectModal({
  handle,
  metadata,
  projectId,
  visible,
  onSuccess,
  onCancel,
}: {
  handle: string | undefined
  metadata: ProjectMetadata | undefined
  projectId: BigNumber
  visible?: boolean
  onSuccess?: VoidFunction
  onCancel?: VoidFunction
}) {
  const { transactor, contracts } = useContext(UserContext)
  const [loadingSetURI, setLoadingSetURI] = useState<boolean>()
  const [loadingSetHandle, setLoadingSetHandle] = useState<boolean>()
  const [projectInfoForm] = useForm<ProjectInfoFormFields>()
  const [handleForm] = useForm<HandleFormFields>()

  useEffect(() => {
    if (metadata) {
      projectInfoForm.setFieldsValue({
        name: metadata?.name,
        infoUrl: metadata?.infoUri,
        logoUrl: metadata?.logoUri,
        description: metadata?.description,
        payText: metadata?.payText,
      })
    }

    if (handle) {
      handleForm.setFieldsValue({ handle })
    }
  }, [handleForm, handle, projectInfoForm, metadata])

  async function setUri() {
    if (!transactor || !contracts?.TerminalV1 || !handle) return

    setLoadingSetURI(true)

    const fields = projectInfoForm.getFieldsValue(true)

    const uploadedMetadata = await uploadProjectMetadata({
      name: fields.name,
      description: fields.description,
      logoUri: fields.logoUrl,
      infoUri: fields.infoUrl,
      payText: fields.payText,
      tokens: [],
      version: 2,
    })

    if (!uploadedMetadata?.success) {
      setLoadingSetURI(false)
      return
    }

    transactor(
      contracts.Projects,
      'setUri',
      [projectId.toHexString(), uploadedMetadata.cid],
      {
        onDone: () => setLoadingSetURI(false),
        onConfirmed: () => {
          if (onSuccess) onSuccess()

          // Set name for new metadata file
          editMetadataForCid(uploadedMetadata.cid, {
            name: metadataNameForHandle(handle),
          })

          // If logo changed
          if (metadata?.logoUri !== fields.logoUrl) {
            // Set name for new logo file
            editMetadataForCid(cidFromUrl(fields.logoUrl), {
              name: logoNameForHandle(handle),
            })
          }

          projectInfoForm.resetFields()
        },
      },
    )
  }

  function setHandle() {
    if (!transactor || !contracts) return

    setLoadingSetHandle(true)

    transactor(
      contracts?.Projects,
      'setHandle',
      [
        projectId.toHexString(),
        utils.formatBytes32String(handleForm.getFieldValue('handle')),
      ],
      {
        onDone: () => setLoadingSetHandle(false),
        onConfirmed: () => handleForm.resetFields(),
      },
    )
  }

  return (
    <Modal
      title="Edit project"
      visible={visible}
      onCancel={onCancel}
      cancelText=""
      width={600}
    >
      <Form form={handleForm} layout="vertical">
        <FormItems.ProjectHandle
          name="handle"
          requireState="notExist"
          value={handleForm.getFieldValue('handle')}
          onValueChange={val => handleForm.setFieldsValue({ handle: val })}
          formItemProps={{ rules: [{ required: true }] }}
        />
        <Form.Item>
          <Button type="primary" loading={loadingSetHandle} onClick={setHandle}>
            Save handle
          </Button>
        </Form.Item>
      </Form>

      <Divider />

      <Form form={projectInfoForm} layout="vertical">
        <FormItems.ProjectName
          name="name"
          formItemProps={{ rules: [{ required: true }] }}
        />
        <FormItems.ProjectLink name="infoUrl" />
        <FormItems.ProjectDescription name="description" />
        <Form.Item
          name="payText"
          label="Pay text"
          extra={'Text displayed on your project\'s "pay" button.'}
        >
          <Input placeholder="Pay" />
        </Form.Item>
        <FormItems.ProjectLogoUrl
          name="logoUrl"
          initialUrl={projectInfoForm.getFieldValue('logoUrl')}
          onSuccess={logoUrl => projectInfoForm.setFieldsValue({ logoUrl })}
        />
        <Form.Item>
          <Button type="primary" loading={loadingSetURI} onClick={setUri}>
            Save changes
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
