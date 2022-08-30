import { Trans } from '@lingui/macro'
import { Drawer } from 'antd'

import { drawerStyle } from 'constants/styles/drawerStyle'
import V2ProjectDetails from '../../V2ProjectSettings/V2ProjectDetails'
import { reloadWindow } from 'utils/windowUtils'

export function V2ReconfigureProjectDetailsDrawer({
  visible,
  onFinish,
}: {
  visible: boolean
  onFinish?: () => void
}) {
  const [projectForm] = useForm<ProjectDetailsFormFields>()

  const [loadingSaveChanges, setLoadingSaveChanges] = useState<boolean>()
  const { projectMetadata, projectId } = useContext(V2ProjectContext)

  const { colors } = useContext(ThemeContext).theme

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
          if (onFinish) onFinish()
          projectForm.resetFields()
          reloadWindow()
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
    <Drawer visible={visible} {...drawerStyle} onClose={onFinish}>
      <h3>
        <Trans>Reconfigure project details</Trans>
      </h3>
      <V2ProjectDetails />
    </Drawer>
  )
}
