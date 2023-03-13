import { RightCircleOutlined } from '@ant-design/icons'
import { Trans } from '@lingui/macro'
import { Button, Skeleton, Space } from 'antd'
import ETHAmount from 'components/currency/ETHAmount'
import Loading from 'components/Loading'
import { ProjectCardProject } from 'components/ProjectCard'
import ProjectLogo from 'components/ProjectLogo'
import { PV_V2 } from 'constants/pv'
import useMobile from 'hooks/Mobile'
import { useProjectMetadata } from 'hooks/ProjectMetadata'
import { useProjectsQuery } from 'hooks/Projects'
import Link from 'next/link'
import { v2v3ProjectRoute } from 'utils/routes'

import { SectionHeading } from './SectionHeading'
import {
  TopProjectsHeading,
  TopProjectsSubheadingOne,
  TopProjectsSubheadingTwo,
} from './strings'

const SmallProjectCardMobile = ({
  project,
}: {
  project: ProjectCardProject
}) => {
  const { data: metadata } = useProjectMetadata(project?.metadataUri)

  return (
    <Link
      key={`${project.id}_${project.pv}`}
      href={
        project.pv === PV_V2
          ? v2v3ProjectRoute(project)
          : `/p/${project?.handle}`
      }
    >
      <a className="flex w-full cursor-pointer items-center gap-2 overflow-hidden border border-solid border-smoke-300 py-2 px-4 text-center transition-colors hover:border-smoke-500 dark:border-slate-300 dark:hover:border-slate-100">
        <div className="flex justify-center">
          <ProjectLogo
            className="h-16 w-16"
            uri={metadata?.logoUri}
            name={metadata?.name}
            projectId={project.projectId}
          />
        </div>

        <div className="w-full font-normal">
          {metadata ? (
            <span className="m-0 overflow-hidden text-ellipsis text-black dark:text-slate-100">
              {metadata.name}
            </span>
          ) : (
            <Skeleton paragraph={false} title={{ width: 120 }} active />
          )}

          <div className="font-medium text-black dark:text-slate-100">
            <ETHAmount amount={project?.totalPaid} precision={0} /> raised
          </div>
        </div>
      </a>
    </Link>
  )
}

const SmallProjectCard = ({ project }: { project: ProjectCardProject }) => {
  const { data: metadata } = useProjectMetadata(project?.metadataUri)

  return (
    <Link
      key={`${project.id}_${project.pv}`}
      href={
        project.pv === PV_V2
          ? v2v3ProjectRoute(project)
          : `/p/${project?.handle}`
      }
    >
      <a>
        <div className="w-44 cursor-pointer overflow-hidden border border-solid border-smoke-300 p-4 text-center transition-colors hover:border-smoke-500 dark:border-slate-300 dark:hover:border-slate-100">
          <div className="mb-2 flex justify-center">
            <ProjectLogo
              className="h-24 w-24"
              uri={metadata?.logoUri}
              name={metadata?.name}
              projectId={project.projectId}
            />
          </div>

          <div className="min-w-0 flex-1 font-normal">
            {metadata ? (
              <span
                className="m-0 block overflow-hidden text-ellipsis whitespace-nowrap text-black dark:text-slate-100"
                title={metadata.name}
              >
                {metadata.name}
              </span>
            ) : (
              <Skeleton paragraph={false} title={{ width: 120 }} active />
            )}

            <div>
              <span className="text-base font-medium text-black dark:text-slate-100">
                <ETHAmount amount={project?.totalPaid} precision={0} /> raised
              </span>
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
}

export function TopProjectsSection() {
  const isMobile = useMobile()

  const { data: previewProjects } = useProjectsQuery({
    pageSize: 4,
  })

  return (
    <section className="bg-smoke-50 p-8 dark:bg-slate-600">
      <div className="my-10 mx-auto max-w-5xl">
        <Space direction="vertical" className="w-full" size="large">
          <div>
            <SectionHeading className="mx-auto max-w-[900px] leading-tight">
              <TopProjectsHeading />
            </SectionHeading>

            <p className="mb-1 text-center text-base text-black dark:text-slate-100">
              <TopProjectsSubheadingOne />
            </p>
            <p className="mb-3 text-center text-base">
              <TopProjectsSubheadingTwo />
            </p>
          </div>

          <div className="mb-3">
            {previewProjects ? (
              <div className="my-0 mx-auto flex w-4/5 flex-wrap justify-between gap-2">
                {previewProjects.map(p =>
                  isMobile ? (
                    <SmallProjectCardMobile key={p.metadataUri} project={p} />
                  ) : (
                    <SmallProjectCard key={p.metadataUri} project={p} />
                  ),
                )}
              </div>
            ) : (
              <Loading />
            )}
          </div>

          <div className="text-center">
            <Space direction="vertical" className="w-full" size="large">
              <Link href="/create">
                <a>
                  <Button size="large" type="primary" block={isMobile}>
                    <Trans>Create a project</Trans>
                  </Button>
                </a>
              </Link>
              <Link href="#how-it-works">
                <a
                  className="cursor-pointer text-sm font-normal text-grey-500 hover:underline dark:text-grey-300"
                  role="button"
                  onClick={() => {
                    document
                      .getElementById('how-it-works')
                      ?.scrollIntoView({ behavior: 'smooth' })
                  }}
                >
                  <Space size="small">
                    <Trans>How does it work?</Trans>
                    <RightCircleOutlined />
                  </Space>
                </a>
              </Link>
            </Space>
          </div>
        </Space>
      </div>
    </section>
  )
}
