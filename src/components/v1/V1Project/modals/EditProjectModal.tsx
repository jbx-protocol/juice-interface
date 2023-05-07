import { t, Trans } from '@lingui/macro'
import { Button, Divider, Form, Modal } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { FormItems } from 'components/formItems'
import { PROJECT_PAY_CHARACTER_LIMIT } from 'constants/numbers'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useSetProjectHandleTx } from 'hooks/v1/transactor/useSetProjectHandleTx'
import { useSetProjectUriTx } from 'hooks/v1/transactor/useSetProjectUriTx'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import { revalidateProject } from 'lib/api/nextjs'
import { PV1 } from 'models/pv'
import { useContext, useEffect, useState } from 'react'

type ProjectInfoFormFields = {
  name: string
  description: string
  infoUri: string
  logoUri: string
  twitter: string
  discord: string
  telegram: string
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
  const { pv, projectMetadata } = useContext(ProjectMetadataContext)

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
        telegram: projectMetadata?.telegram,
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

    const uploadedMetadata = await uploadProjectMetadata({
      name: fields.name,
      description: fields.description,
      logoUri: fields.logoUri,
      infoUri: fields.infoUri,
      twitter: fields.twitter,
      discord: fields.discord,
      telegram: fields.telegram,
      payButton: fields.payButton.substring(0, PROJECT_PAY_CHARACTER_LIMIT), // Enforce limit
      payDisclosure: fields.payDisclosure,
      tokens: projectMetadata?.tokens ?? [],
    })

    if (!uploadedMetadata.Hash) {
      setLoadingSetURI(false)
      return
    }

    setProjectUriTx(
      { cid: uploadedMetadata.Hash },
      {
        onDone: () => setLoadingSetURI(false),
        onConfirmed: async () => {
          if (onSuccess) onSuccess()

          if (pv) {
            await revalidateProject({ pv: pv as PV1, handle })
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
        <FormItems.ProjectTelegram name="telegram" />
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
