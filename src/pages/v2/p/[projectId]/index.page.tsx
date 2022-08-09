import { ProjectMetadataV4 } from 'models/project-metadata'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { V2UserProvider } from 'providers/v2/UserProvider'
import { paginateDepleteProjectsQueryCall } from 'utils/apollo'
import { ipfsCidUrl } from 'utils/ipfs'
import { V2ContractName } from 'models/v2/contracts'
import { loadContract } from 'utils/contracts/loadContract'
import { AppWrapper, SEO } from 'components/common'
import { findProjectMetadata } from 'utils/server'
import Loading from 'components/Loading'

import V2Dashboard from './components/V2Dashboard'
import { readProvider } from 'constants/readProvider'
import { readNetwork } from 'constants/networks'
import { JUICEBOX_MONEY_METADATA_DOMAIN } from 'constants/v2/metadataDomain'
import { V2_PROJECT_IDS } from 'constants/v2/projectIds'

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

export const getStaticProps: GetStaticProps<{
  metadata: ProjectMetadataV4
  projectId: number
}> = async context => {
  if (!context.params) throw new Error('params not supplied')
  const projectId = parseInt(context.params.projectId as string)
  const metadataCid = await getMetadataCidFromContract(projectId)
  const url = ipfsCidUrl(metadataCid)

  try {
    const metadata = await findProjectMetadata({ url })
    return { props: { metadata, projectId } }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e?.response?.status === 404 || e?.response?.status === 400) {
      return { notFound: true }
    }
    throw e
  }
}

export default function V2ProjectPage({
  metadata,
  projectId,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <>
      {metadata ? (
        <SEO
          title={metadata.name}
          url={`${process.env.NEXT_PUBLIC_BASE_URL}v2/p/${projectId}`}
          description={metadata.description}
          twitter={{
            card: 'summary',
            creator: metadata.twitter,
            handle: metadata.twitter,
            image: metadata.logoUri,
            site: metadata.twitter,
          }}
        />
      ) : null}
      <AppWrapper>
        <V2UserProvider>
          {metadata ? (
            <V2Dashboard metadata={metadata} projectId={projectId} />
          ) : (
            <Loading />
          )}
        </V2UserProvider>
      </AppWrapper>
    </>
  )
}
