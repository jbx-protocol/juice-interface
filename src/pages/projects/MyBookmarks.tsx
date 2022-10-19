import { InfoCircleOutlined } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import Grid from 'components/Grid'
import Loading from 'components/Loading'
import ProjectCard from 'components/ProjectCard'
import { ThemeContext } from 'contexts/themeContext'
import { useProjectBookmarks } from 'hooks/db/firebase/ProjectBookmarks'
import { useManyProjectsByIdQuery } from 'hooks/Projects'
import { useWallet } from 'hooks/Wallet'
import { useContext } from 'react'

export default function MyBookmarks() {
  const { userAddress } = useWallet()

  const [data, myDataIsLoading] = useProjectBookmarks()
  const ids = data ? Object.keys(data) : []
  const { data: projects, isLoading } = useManyProjectsByIdQuery(ids)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  if (isLoading || myDataIsLoading) {
    return (
      <div style={{ marginTop: 40 }}>
        <Loading />
      </div>
    )
  }

  if (!userAddress) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: 20,
        }}
      >
        <Trans>Connect your wallet to see your bookmarks.</Trans>
      </div>
    )
  }

  return (
    <>
      {projects && projects.length > 0 && (
        <Grid>
          {projects.map(p => (
            <ProjectCard key={`${p.id}_${p.cv}`} project={p} />
          ))}
        </Grid>
      )}

      {projects &&
        (projects.length === 0 ? (
          <div
            style={{
              textAlign: 'center',
              padding: 20,
            }}
          >
            <p>
              <Trans>You haven't bookmarked any projects yet.</Trans>
            </p>
          </div>
        ) : (
          <div
            style={{
              textAlign: 'center',
              color: colors.text.disabled,
              padding: 20,
            }}
          >
            {projects.length} {projects.length === 1 ? t`project` : t`projects`}{' '}
          </div>
        ))}

      {projects?.length !== 0 && (
        <p style={{ marginBottom: 40, marginTop: 40, maxWidth: 800 }}>
          <InfoCircleOutlined />{' '}
          <Trans>Projects that you have bookmarked.</Trans>
        </p>
      )}
    </>
  )
}
