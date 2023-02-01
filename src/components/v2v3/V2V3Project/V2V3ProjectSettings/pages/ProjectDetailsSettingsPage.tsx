import { useForm } from 'antd/lib/form/Form'
import ProjectDetailsForm, {
  ProjectDetailsFormFields,
} from 'components/forms/ProjectDetailsForm'
import { PROJECT_PAY_CHARACTER_LIMIT } from 'constants/numbers'
import { PV_V2 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/projectMetadataContext'
import { useEditProjectDetailsTx } from 'hooks/v2v3/transactor/EditProjectDetailsTx'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import { revalidateProject } from 'lib/api/nextjs'
import { useCallback, useContext, useEffect, useState } from 'react'

export function ProjectDetailsSettingsPage() {
  const { projectId } = useContext(ProjectMetadataContext)
  const { projectMetadata, refetchProjectMetadata } = useContext(
    ProjectMetadataContext,
  )

  const [loadingSaveChanges, setLoadingSaveChanges] = useState<boolean>()
  const [projectForm] = useForm<ProjectDetailsFormFields>()

  const editV2ProjectDetailsTx = useEditProjectDetailsTx()

  const onProjectFormSaved = useCallback(async () => {
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

    const txSuccess = await editV2ProjectDetailsTx(
      {
        cid: uploadedMetadata.IpfsHash,
      },
      {
        onConfirmed: async () => {
          setLoadingSaveChanges(false)
          if (projectId) {
            await revalidateProject({
              pv: PV_V2,
              projectId: String(projectId),
            })
          }
          refetchProjectMetadata()
        },
        onError: () => {
          setLoadingSaveChanges(false)
        },
        onCancelled: () => {
          setLoadingSaveChanges(false)
        },
      },
    )

    if (!txSuccess) {
      setLoadingSaveChanges(false)
    }
  }, [editV2ProjectDetailsTx, projectForm, projectId, refetchProjectMetadata])

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
