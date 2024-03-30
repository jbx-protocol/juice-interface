import { useForm } from 'antd/lib/form/Form'
import {
  ProjectDetailsForm,
  ProjectDetailsFormFields,
} from 'components/v2v3/V2V3Project/V2V3ProjectSettings/pages/ProjectDetailsSettingsPage/ProjectDetailsForm'
import { PROJECT_PAY_CHARACTER_LIMIT } from 'constants/numbers'
import { PV_V2 } from 'constants/pv'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { useEditProjectDetailsTx } from 'hooks/v2v3/transactor/useEditProjectDetailsTx'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import { revalidateProject } from 'lib/api/nextjs'
import { useCallback, useContext, useEffect, useState } from 'react'
import { withoutHttps } from 'utils/http'
import { emitInfoNotification } from 'utils/notifications'

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
      ...projectMetadata,
      name: fields.name,
      description: fields.description,
      projectTagline: fields.projectTagline,
      projectRequiredOFACCheck: fields.projectRequiredOFACCheck,
      logoUri: fields.logoUri,
      coverImageUri: fields.coverImageUri,
      infoUri: fields.infoUri,
      twitter: fields.twitter,
      discord: fields.discord,
      telegram: fields.telegram,
      payButton: fields.payButton.substring(0, PROJECT_PAY_CHARACTER_LIMIT), // Enforce limit
      payDisclosure: fields.payDisclosure,
      tags: fields.tags,
    })

    if (!uploadedMetadata.Hash) {
      setLoadingSaveChanges(false)
      return
    }

    const txSuccess = await editV2ProjectDetailsTx(
      {
        cid: uploadedMetadata.Hash,
      },
      {
        onConfirmed: async () => {
          setLoadingSaveChanges(false)

          emitInfoNotification('Project details saved', {
            description: 'Your project details have been saved.',
          })

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
  }, [
    editV2ProjectDetailsTx,
    projectForm,
    projectId,
    refetchProjectMetadata,
    projectMetadata,
  ])

  const resetProjectForm = useCallback(() => {
    const infoUri = withoutHttps(projectMetadata?.infoUri ?? '')
    const discord = withoutHttps(projectMetadata?.discord ?? '')
    const telegram = withoutHttps(projectMetadata?.telegram ?? '')
    projectForm.setFieldsValue({
      name: projectMetadata?.name ?? '',
      infoUri,
      logoUri: projectMetadata?.logoUri ?? '',
      coverImageUri: projectMetadata?.coverImageUri ?? '',
      description: projectMetadata?.description ?? '',
      projectTagline: projectMetadata?.projectTagline ?? '',
      projectRequiredOFACCheck:
        projectMetadata?.projectRequiredOFACCheck ?? false,
      twitter: projectMetadata?.twitter ?? '',
      discord,
      telegram,
      payButton: projectMetadata?.payButton ?? '',
      payDisclosure: projectMetadata?.payDisclosure ?? '',
      tags: projectMetadata?.tags ?? [],
    })
  }, [
    projectForm,
    projectMetadata?.name,
    projectMetadata?.infoUri,
    projectMetadata?.logoUri,
    projectMetadata?.coverImageUri,
    projectMetadata?.description,
    projectMetadata?.projectTagline,
    projectMetadata?.projectRequiredOFACCheck,
    projectMetadata?.twitter,
    projectMetadata?.discord,
    projectMetadata?.telegram,
    projectMetadata?.payButton,
    projectMetadata?.payDisclosure,
    projectMetadata?.tags,
  ])

  // initially fill form with any existing redux state
  useEffect(() => {
    // Bug with antd - required to make sure form is reset after initial render
    setTimeout(() => {
      resetProjectForm()
    }, 0)
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
