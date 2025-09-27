import { V5ProjectSEO } from 'components/ProjectPageSEO'
import { PV_V5 } from 'constants/pv'
import { jbUrn } from 'juice-sdk-core'
import { loadCatalog } from 'locales/utils'
import { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import dynamic from 'next/dynamic'
import React, { PropsWithChildren } from 'react'
import {
  getProjectStaticProps,
  ProjectPageProps,
} from 'utils/server/pages/props'

const V4V5ProjectProviders = dynamic(
  () => import('packages/v4v5/views/V4ProjectDashboard/V4V5ProjectProviders'),
  { ssr: false },
)
const ProjectSettingsDashboard = dynamic(
  () =>
    import('packages/v4v5/views/V4ProjectSettings/ProjectSettingsDashboard'),
  { ssr: false },
)

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<
  ProjectPageProps & { i18n: unknown }
> = async context => {
  const locale = context.locale as string
  const messages = await loadCatalog(locale)
  const i18n = { locale, messages }

  if (!context.params) throw new Error('params not supplied')

  const { projectId, chainId } = jbUrn(context.params.jbUrn as string) ?? {}

  const props = (await getProjectStaticProps(
    Number(projectId),
    PV_V5,
    chainId,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  )) as any
  if (props?.props) {
    props.props.i18n = i18n
  }

  return {
    ...props,
    revalidate: 10, // 10 seconds https://nextjs.org/docs/api-reference/data-fetching/get-static-props#revalidate
  }
}

// This is a hack to avoid SSR for now. At the moment when this is not applied to this page, you will see a rehydration error.
const _Wrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const [hasMounted, setHasMounted] = React.useState(false)
  React.useEffect(() => {
    setHasMounted(true)
  }, [])

  if (!hasMounted) {
    return null
  }

  return <>{children}</>
}

export default function V5ProjectSettingsPage({
  metadata,
  projectId,
  chainId,
}: InferGetStaticPropsType<typeof getStaticProps>) {
  if (!chainId || !projectId) {
    return <div>Invalid URL</div>
  }

  return (
    <>
      <V5ProjectSEO
        metadata={metadata}
        chainId={chainId}
        projectId={projectId}
      />
      <_Wrapper>
        <V4V5ProjectProviders chainId={chainId} projectId={BigInt(projectId)}>
          <ProjectSettingsDashboard />
        </V4V5ProjectProviders>
      </_Wrapper>
    </>
  )
}