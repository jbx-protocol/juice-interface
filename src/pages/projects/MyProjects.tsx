import { InfoCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import { Button } from 'antd'
import Grid from 'components/Grid'
import Loading from 'components/Loading'
import ProjectCard from 'components/ProjectCard'
import { useMyProjectsQuery } from 'hooks/Projects'
import { useWallet } from 'hooks/Wallet'
import Link from 'next/link'

export default function MyProjects() {
  const { userAddress } = useWallet()

  const { data: projects, isLoading } = useMyProjectsQuery(userAddress)

  if (isLoading) {
    return (
      <div className="mt-10">
        <Loading />
      </div>
    )
  }

  if (!userAddress) {
    return (
      <div className="p-5 text-center">
        <Trans>Connect your wallet to see your projects.</Trans>
      </div>
    )
  }

  return (
    <>
      {projects && projects.length > 0 && (
        <Grid>
          {projects.map(p => (
            <ProjectCard key={`${p.id}_${p.pv}`} project={p} />
          ))}
        </Grid>
      )}

      {projects &&
        (projects.length === 0 ? (
          <div className="p-5 text-center">
            <p>
              <Trans>You haven't created any projects yet.</Trans>
            </p>

            <Link href="/create">
              <a>
                <Button type="primary">
                  <Trans>Create project</Trans>
                </Button>
              </a>
            </Link>
          </div>
        ) : (
          <div className="p-5 text-center text-grey-400 dark:text-slate-200">
            {projects.length} {projects.length === 1 ? t`project` : t`projects`}{' '}
          </div>
        ))}

      {projects?.length !== 0 && (
        <p className="my-10 max-w-[800px]">
          <InfoCircleOutlined /> <Trans>Projects that you have created.</Trans>
        </p>
      )}
    </>
  )
}
