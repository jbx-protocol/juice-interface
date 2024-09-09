import { useForm } from 'antd/lib/form/Form'
import { ProjectDetailsForm, ProjectDetailsFormFields } from 'components/Project/ProjectSettings/ProjectDetailsForm'
import { PROJECT_PAY_CHARACTER_LIMIT } from 'constants/numbers'
import { ProjectMetadataContext } from 'contexts/ProjectMetadataContext'
import { uploadProjectMetadata } from 'lib/api/ipfs'
import { useEditProjectDetailsTx } from 'packages/v4/hooks/useEditProjectDetailsTx'

import { useCallback, useContext, useEffect, useState } from 'react'
import { withoutHttps } from 'utils/http'
import { emitErrorNotification, emitInfoNotification } from 'utils/notifications'

export function ProjectDetailsSettingsPage() {
  const { projectMetadata, refetchProjectMetadata } = useContext(
    ProjectMetadataContext,
  )

  const [loadingSaveChanges, setLoadingSaveChanges] = useState<boolean>()
  const [projectForm] = useForm<ProjectDetailsFormFields>()

  const editProjectDetailsTx = useEditProjectDetailsTx()

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

    editProjectDetailsTx(
      uploadedMetadata.Hash as `0x${string}`, {
        onTransactionPending: () => null,
        onTransactionConfirmed: () => {
          projectForm?.resetFields()
          setLoadingSaveChanges(false)
          emitInfoNotification('Project details saved', {
            description: 'Your project details have been saved.',
          })

          // v4Todo: part of v2, not sure if necessary 
          // if (projectId) {
          //   await revalidateProject({
          //     pv: PV_V4,
          //     projectId: String(projectId),
          //   })
          // }
          refetchProjectMetadata()
        },
        onTransactionError: (error: unknown) => {
          console.error(error)
          setLoadingSaveChanges(false)
          emitErrorNotification(`Error launching ruleset: ${error}`)
        },
      }
    )
  }, [
    editProjectDetailsTx,
    projectForm,
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
