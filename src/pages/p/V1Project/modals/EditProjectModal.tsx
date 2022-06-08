import { t, Trans } from '@lingui/macro'
import { Button, Divider, Form, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/shared/formItems'
import { useSetProjectHandleTx } from 'hooks/v1/transactor/SetProjectHandleTx'
import { useSetProjectUriTx } from 'hooks/v1/transactor/SetProjectUriTx'
import { ProjectMetadataV4 } from 'models/project-metadata'
import { useEffect, useState } from 'react'
import {
  cidFromUrl,
  editMetadataForCid,
  logoNameForHandle,
  metadataNameForHandle,
  uploadProjectMetadata,
} from 'utils/ipfs'

import { PROJECT_PAY_CHARACTER_LIMIT } from 'constants/numbers'

type ProjectInfoFormFields = {
  name: string
  description: string
  infoUri: string
  logoUri: string
  twitter: string
  discord: string
  payButton: string
  payDisclosure: string
  version: number
}

type HandleFormFields = {
  handle: string
}

export default function EditProjectModal({
  handle,
  metadata,
  visible,
  onSuccess,
  onCancel,
}: {
  handle: string | undefined
  metadata: ProjectMetadataV4 | undefined
  visible?: boolean
  onSuccess?: VoidFunction
  onCancel?: VoidFunction
}) {
  const [loadingSetURI, setLoadingSetURI] = useState<boolean>()
  const [loadingSetHandle, setLoadingSetHandle] = useState<boolean>()
  const [projectInfoForm] = useForm<ProjectInfoFormFields>()
  const [handleForm] = useForm<HandleFormFields>()
  const setProjectUriTx = useSetProjectUriTx()
  const setHandleTx = useSetProjectHandleTx()

  useEffect(() => {
    if (metadata) {
      projectInfoForm.setFieldsValue({
        name: metadata?.name,
        infoUri: metadata?.infoUri,
        logoUri: metadata?.logoUri,
        twitter: metadata?.twitter,
        discord: metadata?.discord,
        description: metadata?.description,
        payButton: metadata?.payButton,
        payDisclosure: metadata?.payDisclosure,
      })
    }

    if (handle) {
      handleForm.setFieldsValue({ handle })
    }
  }, [handleForm, handle, projectInfoForm, metadata])

  async function setUri() {
    if (!handle) return

    setLoadingSetURI(true)

    const fields = projectInfoForm.getFieldsValue(true)

    const uploadedMetadata = await uploadProjectMetadata(
      {
        name: fields.name,
        description: fields.description,
        logoUri: fields.logoUri,
        infoUri: fields.infoUri,
        twitter: fields.twitter,
        discord: fields.discord,
        payButton: fields.payButton.substring(0, PROJECT_PAY_CHARACTER_LIMIT), // Enforce limit
        payDisclosure: fields.payDisclosure,
        tokens: metadata?.tokens ?? [],
      },
      handle,
    )

    if (!uploadedMetadata.IpfsHash) {
      setLoadingSetURI(false)
      return
    }

    setProjectUriTx(
      { cid: uploadedMetadata.IpfsHash },
      {
        onDone: () => setLoadingSetURI(false),
        onConfirmed: () => {
          if (onSuccess) onSuccess()

          // Set name for new metadata file
          editMetadataForCid(uploadedMetadata.IpfsHash, {
            name: metadataNameForHandle(handle),
          })

          // If logo changed
          if (metadata?.logoUri !== fields.logoUri) {
            // Set name for new logo file
            editMetadataForCid(cidFromUrl(fields.logoUri), {
              name: logoNameForHandle(handle),
            })
          }

          projectInfoForm.resetFields()
        },
      },
    )
  }

  function setHandle() {
    setLoadingSetHandle(true)

    setHandleTx(
      { handle: handleForm.getFieldValue('handle') },
      {
        onDone: () => setLoadingSetHandle(false),
        onConfirmed: () => handleForm.resetFields(),
      },
    )
  }

  return (
    <Modal
      title={t`Edit project`}
      visible={visible}
      onCancel={onCancel}
      cancelButtonProps={{ hidden: true }}
      okButtonProps={{ hidden: true }}
      width={600}
    >
      <Form form={handleForm} layout="vertical">
        <FormItems.ProjectHandleFormItem
          name="handle"
          initialValue={handleForm.getFieldValue('handle')}
          requireState="notExist"
          required
        />
        <Form.Item>
          <Button type="primary" loading={loadingSetHandle} onClick={setHandle}>
            <Trans>Save handle</Trans>
          </Button>
        </Form.Item>
      </Form>

      <Divider />

      <Form form={projectInfoForm} layout="vertical">
        <FormItems.ProjectName
          name="name"
          formItemProps={{ rules: [{ required: true }] }}
        />
        <FormItems.ProjectDescription name="description" />
        <FormItems.ProjectLink name="infoUri" />
        <FormItems.ProjectTwitter name="twitter" />
        <FormItems.ProjectDiscord name="discord" />
        <FormItems.ProjectPayButton name="payButton" />
        <FormItems.ProjectPayDisclosure name="payDisclosure" />
        <FormItems.ProjectLogoUri
          name="logoUri"
          initialUrl={projectInfoForm.getFieldValue('logoUri')}
          onSuccess={logoUri => projectInfoForm.setFieldsValue({ logoUri })}
        />
        <Form.Item>
          <Button type="primary" loading={loadingSetURI} onClick={setUri}>
            <Trans>Save changes</Trans>
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  )
}
