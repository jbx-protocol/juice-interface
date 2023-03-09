import { GithubFilled, TwitterCircleFilled } from '@ant-design/icons'
import { t, Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import Discord from 'components/icons/Discord'
import Logo from 'components/Navbar/Logo'
import { TERMS_OF_SERVICE_URL } from 'constants/links'
import { ThemeOption } from 'constants/theme/themeOption'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import Image from 'next/image'
import Link from 'next/link'
import { ReactNode, useContext } from 'react'
import orangeLadyOd from '/public/assets/orange_lady-od.png'
import orangeLadyOl from '/public/assets/orange_lady-ol.png'

type LinkItem = { title: ReactNode; link: string; externalLink?: boolean }

const LinkCols: { title: ReactNode; items: LinkItem[] }[] = [
  {
    title: t`Juicebox`,
    items: [
      {
        title: t`Create project`,
        link: '/create',
      },
      {
        title: t`Explore`,
        link: '/projects',
      },
    ],
  },
  {
    title: t`Resources`,
    items: [
      {
        title: t`Docs`,
        externalLink: true,
        link: 'https://docs.juicebox.money',
      },
      {
        title: t`Newsletter`,
        externalLink: true,
        link: 'https://juicenews.beehiiv.com',
      },
      {
        title: t`Podcast`,
        externalLink: true,
        link: 'https://podcasters.spotify.com/pod/show/thejuicecast',
      },
      {
        title: t`Contact`,
        link: '/contact',
      },
    ],
  },
  {
    title: t`Socials`,
    items: [
      {
        title: t`Discord`,
        externalLink: true,
        link: 'https://discord.com/invite/wFTh4QnDzk',
      },
      {
        title: t`GitHub`,
        externalLink: true,
        link: 'https://github.com/jbx-protocol',
      },
      {
        title: t`Twitter`,
        externalLink: true,
        link: 'https://twitter.com/juiceboxETH',
      },
    ],
  },
  {
    title: t`Legal`,
    items: [
      {
        title: t`Privacy Policy`,
        link: '/privacy',
      },
      {
        title: t`Terms of Service`,
        externalLink: true,
        link: TERMS_OF_SERVICE_URL,
      },
    ],
  },
]

export default function Footer() {
  const gitCommit = process.env.NEXT_PUBLIC_VERSION

  return (
    <>
      <div className="-mb-3 flex justify-center">
        <JuiceLady />
      </div>
      <div className="bg-slate-900 px-12 pt-12 text-white">
        <div className="m-auto max-w-6xl">
          <div className="flex flex-col gap-y-10 md:grid md:grid-cols-6 md:items-start md:gap-x-10">
            <div className="flex flex-col items-center gap-y-5 md:col-span-2 md:items-start">
              <Logo themeOverride="dark" />
              <Trans>
                Big ups to the Ethereum community for crafting the
                infrastructure and economy to make Juicebox possible.
              </Trans>
            </div>
            {LinkCols.map((props, i) => (
              <LinkColumn key={i} {...props} />
            ))}
          </div>

          <div className="mt-32 flex justify-between border border-b-0 border-r-0 border-l-0 border-solid border-slate-400 pb-16 pt-5">
            <span className="text-grey-300">© Juicebox 2023</span>

            <div className="flex gap-x-7">
              {gitCommit && <AppVersion gitCommit={gitCommit} />}
              <div className="flex gap-x-4 text-lg leading-none text-grey-300">
                <GithubFilled />
                <Discord size={18} />
                <TwitterCircleFilled />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

const LinkColumn: React.FC<{ title: ReactNode; items: LinkItem[] }> = ({
  title,
  items,
}) => (
  <div className="flex flex-col gap-y-3">
    <div className="text-grey-300">{title}</div>
    {items.map(({ title, link, externalLink }, i) => (
      <div key={i}>
        {externalLink ? (
          <ExternalLink
            className="text-slate-100 hover:text-haze-400"
            href={link}
          >
            {title}
          </ExternalLink>
        ) : (
          <Link href={link}>
            <a className="text-slate-100 hover:text-haze-400">{title}</a>
          </Link>
        )}
      </div>
    ))}
  </div>
)

const AppVersion = ({ gitCommit }: { gitCommit: string }) => {
  const gitCommitLink = `https://github.com/jbx-protocol/juice-interface/commit/${gitCommit}`
  return (
    <div className="text-grey-300">
      Version:{' '}
      <ExternalLink
        href={gitCommitLink}
        className="text-grey-300 underline hover:text-haze-400"
      >
        #{gitCommit}
      </ExternalLink>
    </div>
  )
}

const JuiceLady = () => {
  const { forThemeOption } = useContext(ThemeContext)
  return (
    <Image
      src={forThemeOption?.({
        [ThemeOption.dark]: orangeLadyOd,
        [ThemeOption.light]: orangeLadyOl,
      })}
      alt="Powerlifting Juicebox orange hitting an olympic lift"
      loading="lazy"
    />
  )
}
