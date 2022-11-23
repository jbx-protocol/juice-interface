import { InfoCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import Grid from 'components/Grid'
import Loading from 'components/Loading'
import ProjectCard from 'components/ProjectCard'
import { useHoldingsProjectsQuery } from 'hooks/Projects'
import { useWallet } from 'hooks/Wallet'

export default function HoldingsProjects() {
  const { userAddress } = useWallet()

  const { data: projects, isLoading } = useHoldingsProjectsQuery(userAddress)

  if (!userAddress) {
    return (
      <div className="p-5 text-center" hidden={isLoading}>
        <Trans>Connect your wallet to see your holdings.</Trans>
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

      {!isLoading &&
        projects &&
        (projects.length === 0 ? (
          <div
            className="p-5 text-center text-grey-400 dark:text-slate-200"
            hidden={isLoading}
          >
            <Trans>You don't hold tokens for any Juicebox project.</Trans>
          </div>
        ) : (
          <div className="p-5 text-center text-grey-400 dark:text-slate-200">
            {projects.length} {projects.length === 1 ? t`project` : t`projects`}{' '}
          </div>
        ))}

      {isLoading && (
        <div className="mt-10">
          <Loading />
        </div>
      )}

      {projects?.length !== 0 && (
        <p className="my-10 max-w-[800px]">
          <InfoCircleOutlined />{' '}
          <Trans>Projects that you hold tokens for.</Trans>
        </p>
      )}
    </>
  )
}
