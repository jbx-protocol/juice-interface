import { PV_V1 } from 'constants/pv'
import { paginateDepleteProjectsQueryCall } from 'lib/apollo/paginateDepleteProjectsQuery'
import { ProjectMetadata } from 'models/projectMetadata'
import { GetStaticPaths, GetStaticProps } from 'next'
import { findProjectMetadata } from 'utils/server'

export interface V1StaticProps {
  metadata: ProjectMetadata
  handle: string
}

export const getV1StaticPaths: GetStaticPaths = async () => {
  if (process.env.BUILD_CACHE_V1_PROJECTS === 'true') {
    const projects = await paginateDepleteProjectsQueryCall({
      variables: {
        where: { pv: PV_V1 },
      },
    })
    const paths = projects
      .map(({ handle }) =>
        handle
          ? {
              params: { handle },
            }
          : undefined,
      )
      .filter((i): i is { params: { handle: string } } => !!i)
    return { paths, fallback: true }
  }

  // TODO: We are switching to blocking as blocking fallback as its just not
  // working. Need to investigate further
  return { paths: [], fallback: 'blocking' }
}

export const getV1StaticProps: GetStaticProps<
  V1StaticProps
> = async context => {
  if (!context.params) throw new Error('params not supplied')
  const handle = context.params.handle as string
  const projects = await paginateDepleteProjectsQueryCall({
    variables: {
      where: { pv: PV_V1, handle },
      first: 1,
    },
  })
  if (!projects[0]?.metadataUri) {
    console.error(
      `Failed to load metadata uri for ${JSON.stringify(context.params)}`,
    )
    return { notFound: true, props: undefined }
  }

  try {
    const metadata = await findProjectMetadata({
      metadataCid: projects[0].metadataUri,
    })
    return {
      props: { metadata, handle },
      revalidate: 10, // 10 seconds https://nextjs.org/docs/api-reference/data-fetching/get-static-props#revalidate
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    if (e?.response?.status === 404) {
      return { notFound: true, props: undefined }
    }
    throw e
  }
}
