import { useForm } from 'antd/lib/form/Form'
import ProjectDetailsForm, {
  ProjectDetailsFormFields,
} from 'components/forms/ProjectDetailsForm'
import { PROJECT_PAY_CHARACTER_LIMIT } from 'constants/numbers'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useEditV2ProjectDetailsTx } from 'hooks/v2/transactor/EditV2ProjectDetailsTx'
import React, { useCallback, useContext, useEffect, useState } from 'react'
import { uploadProjectMetadata } from 'utils/ipfs'
import { revalidateProject } from 'utils/revalidateProject'

export function V2ProjectDetailsSettingsPage() {
  const [projectForm] = useForm<ProjectDetailsFormFields>()

  const [loadingSaveChanges, setLoadingSaveChanges] = useState<boolean>()
  const { projectId } = useContext(V2ProjectContext)
  const { projectMetadata } = useContext(ProjectMetadataContext)

  const EditV2ProjectDetailsTx = useEditV2ProjectDetailsTx()

  async function onProjectFormSaved() {
    setLoadingSaveChanges(true)

    const fields = projectForm.getFieldsValue(true)

    const uploadedMetadata = await uploadProjectMetadata({
      name: fields.name,
      description: fields.description,
      logoUri: fields.logoUri,
      infoUri: fields.infoUri,
      twitter: fields.twitter,
      discord: fields.discord,
      payButton: fields.payButton.substring(0, PROJECT_PAY_CHARACTER_LIMIT), // Enforce limit
      payDisclosure: fields.payDisclosure,
    })

    if (!uploadedMetadata.IpfsHash) {
      setLoadingSaveChanges(false)
      return
    }

    EditV2ProjectDetailsTx(
      { cid: uploadedMetadata.IpfsHash },
      {
        onDone: () => setLoadingSaveChanges(false),
        onConfirmed: async () => {
          if (projectId) {
            await revalidateProject({
              cv: '2',
              projectId: String(projectId),
            })
          }
          projectForm.resetFields()
        },
      },
    )
  }

  const resetProjectForm = useCallback(() => {
    projectForm.setFieldsValue({
      name: projectMetadata?.name ?? '',
      infoUri: projectMetadata?.infoUri ?? '',
      logoUri: projectMetadata?.logoUri ?? '',
      description: projectMetadata?.description ?? '',
      twitter: projectMetadata?.twitter ?? '',
      discord: projectMetadata?.discord ?? '',
      payButton: projectMetadata?.payButton ?? '',
      payDisclosure: projectMetadata?.payDisclosure ?? '',
    })
  }, [
    projectMetadata?.name,
    projectMetadata?.infoUri,
    projectMetadata?.logoUri,
    projectMetadata?.description,
    projectMetadata?.twitter,
    projectMetadata?.discord,
    projectMetadata?.payDisclosure,
    projectMetadata?.payButton,
    projectForm,
  ])

  // initially fill form with any existing redux state
  useEffect(() => {
    resetProjectForm()
  }, [resetProjectForm])

  return (
    <ProjectDetailsForm
      form={projectForm}
      onFinish={onProjectFormSaved}
      hideProjectHandle
      loading={loadingSaveChanges}
    />
  )
}
