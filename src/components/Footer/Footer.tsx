import { GithubFilled, TwitterCircleFilled } from '@ant-design/icons'
import { Trans, t } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import Logo from 'components/Logo'
import Discord from 'components/icons/Discord'
import { TERMS_OF_SERVICE_URL } from 'constants/links'
import Link from 'next/link'
import { ReactNode } from 'react'

type LinkItem = {
  title: ReactNode
  link: string
  externalLink?: boolean
}

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
      {
        title: t`Activity`,
        link: '/activity',
      },
      // Comment out till launch
      // {
      //   title: t`About`,
      //   link: '/about',
      // },
      {
        title: t`Referral`,
        externalLink: true,
        link: 'https://juicebox.referral.qwestive.io/referral/hJCUZVJIodVP6Ki6MP6e',
      },
      {
        title: t`Request a feature`,
        externalLink: true,
        link: 'https://juicebox.canny.io/feature-requests',
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

const ImageButtons = [
  {
    name: 'github',
    image: <GithubFilled />,
    link: 'https://github.com/jbx-protocol',
  },
  {
    name: 'discord',
    image: <Discord size={18} />,
    link: 'https://discord.com/invite/wFTh4QnDzk',
  },
  {
    name: 'twitter',
    image: <TwitterCircleFilled />,
    link: 'https://twitter.com/juiceboxETH',
  },
]

export function Footer() {
  const gitCommit = process.env.NEXT_PUBLIC_VERSION

  return (
    <div className="bg-slate-900 px-12 pt-12 text-sm text-slate-100">
      <div className="m-auto max-w-6xl">
        <div className="flex flex-col gap-y-10 md:grid md:grid-cols-6 md:items-start md:gap-x-10">
          <div className="flex flex-col gap-y-5 text-slate-200 md:col-span-2 md:items-start">
            <Logo themeOverride="dark" />
            <Trans>
              Big ups to the Ethereum community for crafting the infrastructure
              and economy to make Juicebox possible.
            </Trans>
          </div>
          {LinkCols.map((props, i) => (
            <LinkColumn key={i} {...props} />
          ))}
        </div>

        <div className="mt-32 flex justify-between border-t border-slate-400 pb-16 pt-5">
          <span className="text-slate-200">© Juicebox 2023</span>

          <div className="flex gap-x-7">
            {gitCommit && <AppVersion gitCommit={gitCommit} />}
            <div className="flex gap-x-4 ">
              {ImageButtons.map(({ name, image, link }) => (
                <ExternalLink
                  key={name}
                  name={name}
                  title={name}
                  className="text-lg leading-none text-slate-200 hover:text-bluebs-500"
                  href={link}
                >
                  {image}
                </ExternalLink>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const LinkColumn: React.FC<{ title: ReactNode; items: LinkItem[] }> = ({
  title,
  items,
}) => (
  <div className="flex flex-col gap-y-3">
    <div className="font-semibold text-slate-200">{title}</div>
    {items.map(({ title, link, externalLink }, i) => (
      <div key={i}>
        {externalLink ? (
          <ExternalLink
            className="text-white hover:text-bluebs-500"
            href={link}
          >
            {title}
          </ExternalLink>
        ) : (
          <Link href={link}>
            <a className="text-white hover:text-bluebs-500">{title}</a>
          </Link>
        )}
      </div>
    ))}
  </div>
)

const AppVersion = ({ gitCommit }: { gitCommit: string }) => {
  const gitCommitLink = `https://github.com/jbx-protocol/juice-interface/commit/${gitCommit}`
  return (
    <div className="text-slate-200">
      Version:{' '}
      <ExternalLink
        href={gitCommitLink}
        className="text-slate-200 underline hover:text-bluebs-500"
      >
        #{gitCommit}
      </ExternalLink>
    </div>
  )
}
