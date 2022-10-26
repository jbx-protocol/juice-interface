import { useForm } from 'antd/lib/form/Form'
import ProjectDetailsForm, {
  ProjectDetailsFormFields,
} from 'components/forms/ProjectDetailsForm'
import { PROJECT_PAY_CHARACTER_LIMIT } from 'constants/numbers'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { useEditProjectDetailsTx } from 'hooks/v2v3/transactor/EditProjectDetailsTx'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import { revalidateProject } from 'lib/api/nextjs'
import { CV2V3 } from 'models/cv'
import React, { useCallback, useContext, useEffect, useState } from 'react'

export function ProjectDetailsSettingsPage() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { projectMetadata, cv } = useContext(ProjectMetadataContext)

  const [loadingSaveChanges, setLoadingSaveChanges] = useState<boolean>()
  const [projectForm] = useForm<ProjectDetailsFormFields>()

  const EditV2ProjectDetailsTx = useEditProjectDetailsTx()

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
              cv: cv as CV2V3,
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
