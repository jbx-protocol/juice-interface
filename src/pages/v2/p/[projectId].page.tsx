import axios from 'axios'
import { consolidateMetadata, ProjectMetadataV4 } from 'models/project-metadata'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { V2UserProvider } from 'providers/v2/UserProvider'
import { paginateDepleteProjectsQueryCall } from 'utils/apollo'
import { ipfsCidUrl } from 'utils/ipfs'
import { V2ContractName } from 'models/v2/contracts'
import { loadContract } from 'utils/contracts/loadContract'
import { SEO } from 'components/common'

import V2Dashboard from './components/V2Dashboard'
import { readProvider } from 'constants/readProvider'
import { readNetwork } from 'constants/networks'
import { JUICEBOX_MONEY_METADATA_DOMAIN } from 'constants/v2/metadataDomain'

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
  const projects = await paginateDepleteProjectsQueryCall({
    variables: { where: { cv: '2' } },
  })
  const paths = projects.map(({ projectId }) => ({
    params: { projectId: String(projectId) },
  }))
  return { paths, fallback: true }
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
    let metadata: ProjectMetadataV4 | undefined
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let error: any | undefined
    do {
      try {
        if (error) {
          // Back off for 3 secs - pinata rate limits for 180/min
          const PINATA_RATE_LIMIT_SECONDS = 180
          const SECONDS_IN_MINUTES = 60
          await new Promise(resolve =>
            setTimeout(
              resolve,
              (PINATA_RATE_LIMIT_SECONDS / SECONDS_IN_MINUTES) * 1000,
            ),
          )
        }
        const response = await axios.get(url)
        metadata = consolidateMetadata(response.data)
        error = undefined
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        const status = e?.response?.status
        if (status === 404 || status === 400) {
          console.error('Page not found', {
            url,
            projectId,
          })
          return { notFound: true }
        }
        console.warn('Failed to get url - backing off 3 seconds', {
          status: status,
          projectId,
          url,
          e,
        })
        error = e
      }
    } while (!metadata)

    Object.keys(metadata).forEach(key =>
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (metadata as any)[key] === undefined ? delete (metadata as any)[key] : {},
    )
    return {
      props: { metadata, projectId },
      revalidate: 60, // Revalidate the cached page every 60secs
    }
  } catch (e) {
    console.error('Failed to load page props', e)
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
      <V2UserProvider>
        <V2Dashboard metadata={metadata} projectId={projectId} />
      </V2UserProvider>
    </>
  )
}
