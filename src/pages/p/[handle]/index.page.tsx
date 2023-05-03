import Loading from 'components/Loading'
import Project404 from 'components/Project404'
import { AppWrapper, SEO } from 'components/common'
import { V1Project } from 'components/v1/V1Project'
import { AnnouncementLauncher } from 'contexts/Announcements/AnnouncementLauncher'
import { ProjectMetadataContext } from 'contexts/shared/ProjectMetadataContext'
import { V1ProjectProvider } from 'contexts/v1/Project/V1ProjectProvider'
import { V1UserProvider } from 'contexts/v1/User/V1UserProvider'
import { V1CurrencyProvider } from 'contexts/v1/V1CurrencyProvider'
import { V1ProjectMetadataProvider } from 'contexts/v1/V1ProjectMetadataProvider'
import { ProjectMetadata } from 'models/projectMetadata'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import { useRouter } from 'next/router'
import { useContext } from 'react'
import { Provider } from 'react-redux'
import store from 'redux/store'
import { cidFromUrl, ipfsPublicGatewayUrl } from 'utils/ipfs'
import { getV1StaticPaths, getV1StaticProps } from './pageLoaders'

export interface V1StaticProps {
  metadata: ProjectMetadata
  handle: string
}

export const getStaticPaths: GetStaticPaths = async context => {
  return getV1StaticPaths(context)
}

export const getStaticProps: GetStaticProps<V1StaticProps> = async context => {
  return getV1StaticProps(context)
}

export default function V1HandlePage({
  metadata,
  handle,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  // Checks URL to see if user was just directed from project deploy
  return (
    <>
      <SEO
        // Set known values, leave others undefined to be overridden
        title={metadata?.name}
        url={`${process.env.NEXT_PUBLIC_BASE_URL}p/${handle}`}
        description={metadata?.description ? metadata.description : undefined}
        twitter={{
          card: 'summary',
          creator: metadata?.twitter,
          handle: metadata?.twitter,
          // Swap out all gateways with ipfs.io public gateway until we can resolve our meta tag issue.
          image: metadata?.logoUri
            ? ipfsPublicGatewayUrl(cidFromUrl(metadata.logoUri))
            : undefined,
        }}
      />
      <AppWrapper>
        <Provider store={store}>
          {metadata ? (
            <V1UserProvider>
              <V1ProjectMetadataProvider handle={handle} metadata={metadata}>
                <V1ProjectProvider handle={handle}>
                  <V1CurrencyProvider>
                    <AnnouncementLauncher>
                      <V1Dashboard />
                    </AnnouncementLauncher>
                  </V1CurrencyProvider>
                </V1ProjectProvider>
              </V1ProjectMetadataProvider>
            </V1UserProvider>
          ) : (
            <Loading />
          )}
        </Provider>
      </AppWrapper>
    </>
  )
}

function V1Dashboard() {
  const { projectId } = useContext(ProjectMetadataContext)
  const router = useRouter()

  const handle = router.query.handle as string

  if (!handle) return <Project404 projectId={handle} />
  if (!projectId) return <Loading />
  if (projectId === 0) {
    return <Project404 projectId={handle} />
  }

  return <V1Project />
}
