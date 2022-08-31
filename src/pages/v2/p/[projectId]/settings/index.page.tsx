import { AppWrapper } from 'components/common'
import V2ProjectSettings from 'components/v2/V2Project/V2ProjectSettings/V2ProjectSettings'
import { readNetwork } from 'constants/networks'
import { readProvider } from 'constants/readProvider'
import { JUICEBOX_MONEY_METADATA_DOMAIN } from 'constants/v2/metadataDomain'
import { V2_PROJECT_IDS } from 'constants/v2/projectIds'
import { ProjectMetadataV4 } from 'models/project-metadata'
import { V2ContractName } from 'models/v2/contracts'
import { GetStaticPaths, GetStaticProps } from 'next'
import { V2UserProvider } from 'providers/v2/UserProvider'
import V2ProjectProvider from 'providers/v2/V2ProjectProvider'
import { paginateDepleteProjectsQueryCall } from 'utils/apollo'
import { loadContract } from 'utils/contracts'
import { findProjectMetadata } from 'utils/server'

async function getMetadataCidFromContract(projectId: number) {
  const network = readNetwork.name
  const contract = await loadContract(
    V2ContractName.JBProjects,
    network,
    readProvider,
  )
  if (!contract) {
    throw new Error(`contract not found ${V2ContractName.JBProjects}`)
  }
  const metadataCid = (await contract.metadataContentOf(
    projectId,
    JUICEBOX_MONEY_METADATA_DOMAIN,
  )) as string
  return metadataCid
}

export const getStaticProps: GetStaticProps<{
  metadata: ProjectMetadataV4
  projectId: number
}> = async context => {
  if (!context.params) throw new Error('params not supplied')
  const projectId = parseInt(context.params.projectId as string)
  if (isNaN(projectId)) {
    return { notFound: true }
  }
  const metadataCid = await getMetadataCidFromContract(projectId)

  try {
    const metadata = await findProjectMetadata({ metadataCid })
    return { props: { metadata, projectId } }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e?.response?.status === 404 || e?.response?.status === 400) {
      return { notFound: true }
    }
    throw e
  }
}

export const getStaticPaths: GetStaticPaths = async () => {
  if (process.env.BUILD_CACHE_V2_PROJECTS === 'true') {
    const projects = await paginateDepleteProjectsQueryCall({
      variables: { where: { cv: '2' } },
    })
    const paths = projects.map(({ projectId }) => ({
      params: { projectId: String(projectId) },
    }))
    return { paths, fallback: true }
  }

  return {
    paths: [{ params: { projectId: String(V2_PROJECT_IDS.JUICEBOX_DAO) } }],
    fallback: true,
  }
}

export default function V2ProjectSettingsPage({
  projectId,
  metadata,
}: {
  projectId: number
  metadata: ProjectMetadataV4
}) {
  return (
    <AppWrapper>
      <V2UserProvider>
        <V2ProjectProvider projectId={projectId} metadata={metadata}>
          <V2ProjectSettings />
        </V2ProjectProvider>
      </V2UserProvider>
    </AppWrapper>
  )
}
