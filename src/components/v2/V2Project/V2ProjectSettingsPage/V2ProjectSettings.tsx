import { Layout, Menu, MenuProps } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import ProjectDetailsForm, {
  ProjectDetailsFormFields,
} from 'components/forms/ProjectDetailsForm'

import { V2ProjectContext } from 'contexts/v2/projectContext'
import { useEditV2ProjectDetailsTx } from 'hooks/v2/transactor/EditV2ProjectDetailsTx'
import Link from 'next/link'
import { useState, useContext, useCallback, useEffect } from 'react'
import { uploadProjectMetadata } from 'utils/ipfs'
import { revalidateProject } from 'utils/revalidateProject'

import { PROJECT_PAY_CHARACTER_LIMIT } from 'constants/numbers'
const { Content, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('Project', 'project', undefined, [
    getItem('General', 'project1'),
    getItem('Project handle', 'project2'),
  ]),
  getItem('Funding', 'funding', undefined, [
    getItem('Funding cycle', 'funding1'),
    getItem('Payouts', 'funding2'),
    getItem('Reserved tokens', 'funding3'),
  ]),
  getItem('Manage', 'manage', undefined, [
    getItem('Payment addresses', 'manage1'),
    getItem('V1 token migration', 'manage2'),
    getItem('veNFT', 'manage3'),
  ]),
]

const V2ProjectSettings = () => {
  const [projectForm] = useForm<ProjectDetailsFormFields>()

  const [loadingSaveChanges, setLoadingSaveChanges] = useState<boolean>()
  const { projectMetadata, projectId } = useContext(V2ProjectContext)

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
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Sider style={{ background: 'transparent' }}>
        <Link href={`project`}>{`< Back to Project`}</Link>
        <Menu
          defaultOpenKeys={['project', 'funding', 'manage']}
          defaultSelectedKeys={['project1']}
          mode="inline"
          theme="dark"
          items={items}
        />
      </Sider>
      <Layout style={{ background: 'transparent' }}>
        <Content style={{ margin: '0 16px' }}>
          <ProjectDetailsForm
            form={projectForm}
            onFinish={onProjectFormSaved}
            hideProjectHandle
            loading={loadingSaveChanges}
          />
        </Content>
      </Layout>
    </Layout>
  )
}

export default V2ProjectSettings
