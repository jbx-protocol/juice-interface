import { t, Trans } from '@lingui/macro'
import { Button, Divider, Form, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/formItems'
import { PROJECT_PAY_CHARACTER_LIMIT } from 'constants/numbers'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { useSetProjectHandleTx } from 'hooks/v1/transactor/SetProjectHandleTx'
import { useSetProjectUriTx } from 'hooks/v1/transactor/SetProjectUriTx'
import { editMetadataForCid, uploadProjectMetadata } from 'lib/api/ipfs'
import { revalidateProject } from 'lib/api/nextjs'
import { V1TerminalVersion } from 'models/v1/terminals'
import { useContext, useEffect, useState } from 'react'
import {
  cidFromUrl,
  logoNameForHandle,
  metadataNameForHandle,
} from 'utils/ipfs'

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
  open,
  onSuccess,
  onCancel,
}: {
  handle: string | undefined
  open?: boolean
  onSuccess?: VoidFunction
  onCancel?: VoidFunction
}) {
  const { cv, projectMetadata } = useContext(ProjectMetadataContext)

  const [loadingSetURI, setLoadingSetURI] = useState<boolean>()
  const [loadingSetHandle, setLoadingSetHandle] = useState<boolean>()
  const [projectInfoForm] = useForm<ProjectInfoFormFields>()
  const [handleForm] = useForm<HandleFormFields>()

  const setProjectUriTx = useSetProjectUriTx()
  const setHandleTx = useSetProjectHandleTx()

  useEffect(() => {
    if (projectMetadata) {
      projectInfoForm.setFieldsValue({
        name: projectMetadata?.name,
        infoUri: projectMetadata?.infoUri,
        logoUri: projectMetadata?.logoUri,
        twitter: projectMetadata?.twitter,
        discord: projectMetadata?.discord,
        description: projectMetadata?.description,
        payButton: projectMetadata?.payButton,
        payDisclosure: projectMetadata?.payDisclosure,
      })
    }

    if (handle) {
      handleForm.setFieldsValue({ handle })
    }
  }, [handleForm, handle, projectInfoForm, projectMetadata])

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
        tokens: projectMetadata?.tokens ?? [],
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
        onConfirmed: async () => {
          if (onSuccess) onSuccess()

          if (cv) {
            await revalidateProject({ cv: cv as V1TerminalVersion, handle })
          }

          // Set name for new metadata file
          editMetadataForCid(uploadedMetadata.IpfsHash, {
            name: metadataNameForHandle(handle),
          })

          // If logo changed
          if (projectMetadata?.logoUri !== fields.logoUri) {
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
      open={open}
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
