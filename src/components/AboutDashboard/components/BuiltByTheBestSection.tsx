import { Trans } from '@lingui/macro'
import { useSupabaseClient } from '@supabase/auth-helpers-react'
import { Button } from 'antd'
import ExternalLink from 'components/ExternalLink'
import Loading from 'components/Loading'
import { TruncatedText } from 'components/TruncatedText'
import { Contributor } from 'models/database'
import { useEffect, useState } from 'react'
import { Database } from 'types/database.types'
import { SectionContainer } from './SectionContainer'

export const BuiltByTheBestSection = () => {
  const supabase = useSupabaseClient<Database>()
  const [contributors, setContributors] = useState<Contributor[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchContributors = async () => {
      setLoading(true)
      try {
        const { data: contributors, error } = await supabase
          .from('contributors')
          .select('*')

        if (error) {
          console.error(error)
          setError(error.message)
        }

        if (contributors) {
          setContributors(contributors)
        }
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (e: any) {
        console.error(e)
        setError(e?.message ?? 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchContributors()
  }, [supabase])

  return (
    <SectionContainer className="text-center md:py-24">
      <h2 className="text-4xl">
        <Trans>Built by the best</Trans>
      </h2>
      <p className="mx-auto mb-16 max-w-3xl text-lg text-grey-700 dark:text-slate-200 md:text-xl">
        <Trans>
          Huge shoutout to the epic team of people that help build Juicebox and
          keep the dream alive.
        </Trans>
      </p>

      {loading ? (
        <Loading size="large" />
      ) : error ? (
        <></>
      ) : (
        <div className="mx-auto grid grid-cols-2 gap-x-8 gap-y-16 sm:grid-cols-5">
          {contributors
            .sort((a, b) => a.name.localeCompare(b.name))
            .map(contributor => (
              <ContributorCard
                key={contributor.id}
                name={contributor.name}
                title={contributor.title ?? undefined}
                avatarUrl={contributor.avatar_url ?? undefined}
              />
            ))}
        </div>
      )}

      <div className="mx-auto mt-24 max-w-xl">
        <h3 className="font-header text-primary text-xl font-medium">
          <Trans>Interested in becoming a JuiceboxDAO contributor?</Trans>
        </h3>
        <p className="m-0">
          <Trans>
            We're always looking for talented people to join the DAO and help
            build Juicebox. Hit the button below to find out more.
          </Trans>
        </p>
        <ExternalLink href="https://docs.juicebox.money/dao/contribute/">
          <Button className="mt-8">Become a contributor</Button>
        </ExternalLink>
      </div>
    </SectionContainer>
  )
}

const ContributorCard: React.FC<
  React.PropsWithChildren<{
    name: string
    title: string | undefined
    avatarUrl: string | undefined
  }>
> = ({ name, title, avatarUrl }) => {
  const [validAvatar, setValidAvatar] = useState(true)

  const handleImageError = () => {
    setValidAvatar(false)
  }

  return (
    <div className="max-w-[216px] overflow-hidden">
      {avatarUrl && validAvatar ? (
        <img
          className="mx-auto mb-5 h-14 w-14 rounded-full md:h-20 md:w-20"
          src={avatarUrl}
          alt={name}
          onError={handleImageError}
        />
      ) : (
        <div className="mx-auto mb-5 h-20 w-20 rounded-full bg-bluebs-400" />
      )}
      <TruncatedText
        className="text-primary mb-2 font-heading text-base font-medium md:text-xl"
        text={name}
        placement={title ? 'top' : 'bottom'}
      />
      {title && (
        <TruncatedText
          className="text-secondary"
          text={title}
          placement="bottom"
        />
      )}
    </div>
  )
}
