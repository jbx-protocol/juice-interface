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
  const { info: editingV2ProjectInfo } = useAppSelector(
    state => state.editingV2Project,
  )
  const onProjectFormSaved = useCallback(() => {
    const fields = projectForm.getFieldsValue(true)
    dispatch(editingV2ProjectActions.setName(fields.name))
    dispatch(editingV2ProjectActions.setInfoUri(fields.infoUri))
    dispatch(editingV2ProjectActions.setHandle(fields.handle))
    dispatch(editingV2ProjectActions.setLogoUri(fields.logoUri))
    dispatch(editingV2ProjectActions.setDescription(fields.description))
    dispatch(editingV2ProjectActions.setTwitter(fields.twitter))
    dispatch(editingV2ProjectActions.setDiscord(fields.discord))
    dispatch(editingV2ProjectActions.setPayButton(fields.payButton))
    dispatch(editingV2ProjectActions.setPayDisclosure(fields.payDisclosure))
  }, [dispatch, projectForm])

  const resetProjectForm = useCallback(() => {
    projectForm.setFieldsValue({
      name: editingV2ProjectInfo?.metadata.name ?? '',
      handle: editingV2ProjectInfo?.handle ?? '',
    })
  }, [
    editingV2ProjectInfo.handle,
    editingV2ProjectInfo.metadata.name,
    projectForm,
  ])

  // initially fill form with any existing redux state
  useEffect(() => {
    resetProjectForm()
  }, [resetProjectForm])

  return (
    <div>
      <Space direction="vertical" size="large">
        <ProjectDetailsForm form={projectForm} onSave={onProjectFormSaved} />
      </Space>
    </div>
  )
}
