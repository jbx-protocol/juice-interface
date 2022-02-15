import { Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import ProjectDetailsForm, {
  ProjectDetailsFormFields,
} from 'components/shared/forms/ProjectDetailsForm'
import { useAppDispatch } from 'hooks/AppDispatch'
import { useAppSelector } from 'hooks/AppSelector'
import { useCallback, useEffect } from 'react'
import { editingV2ProjectActions } from 'redux/slices/editingV2Project'

export default function ProjectDetailsTabContent() {
  const [projectForm] = useForm<ProjectDetailsFormFields>()
  const dispatch = useAppDispatch()
  const { projectMetadata } = useAppSelector(state => state.editingV2Project)

  const onProjectFormSaved = useCallback(
    (fields: ProjectDetailsFormFields) => {
      dispatch(editingV2ProjectActions.setName(fields.name))
      dispatch(editingV2ProjectActions.setInfoUri(fields.infoUri))
      dispatch(editingV2ProjectActions.setLogoUri(fields.logoUri))
      dispatch(editingV2ProjectActions.setDescription(fields.description))
      dispatch(editingV2ProjectActions.setTwitter(fields.twitter))
      dispatch(editingV2ProjectActions.setDiscord(fields.discord))
      dispatch(editingV2ProjectActions.setPayButton(fields.payButton))
      dispatch(editingV2ProjectActions.setPayDisclosure(fields.payDisclosure))
    },
    [dispatch],
  )

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
    <Space direction="vertical" size="large">
      <ProjectDetailsForm
        form={projectForm}
        onSave={onProjectFormSaved}
        hideProjectHandle
      />
    </Space>
  )
}
