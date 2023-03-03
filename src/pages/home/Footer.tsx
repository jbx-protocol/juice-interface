import { Trans } from '@lingui/macro'
import ExternalLink from 'components/ExternalLink'
import { TERMS_OF_SERVICE_URL } from 'constants/links'
import { ThemeOption } from 'constants/theme/themeOption'
import { ThemeContext } from 'contexts/Theme/ThemeContext'
import Image from 'next/image'
import Link from 'next/link'
import { useContext } from 'react'
import orangeLadyOd from '/public/assets/orange_lady-od.png'
import orangeLadyOl from '/public/assets/orange_lady-ol.png'

export default function Footer() {
  const { forThemeOption } = useContext(ThemeContext)

  const link = (text: string, link: string) => {
    if (link.startsWith('http')) {
      return (
        <ExternalLink
          className="mx-2 text-haze-400 dark:text-haze-300"
          href={link}
        >
          {text}
        </ExternalLink>
      )
    }
    return (
      <Link href={link}>
        <a className="mx-2 text-haze-400 dark:text-haze-300">{text}</a>
      </Link>
    )
  }

  const gitCommit = process.env.NEXT_PUBLIC_VERSION
  const gitCommitLink = `https://github.com/jbx-protocol/juice-interface/commit/${gitCommit}`

  return (
    <div>
      <div className="-mb-3 flex justify-center">
        <Image
          src={forThemeOption?.({
            [ThemeOption.dark]: orangeLadyOd,
            [ThemeOption.light]: orangeLadyOl,
          })}
          alt="Powerlifting Juicebox orange hitting an olympic lift"
          loading="lazy"
        />
      </div>

      <div className="bg-black p-10 text-center">
        <div className="mb-5 text-xl">🧃⚡️</div>
        <p className="m-0 text-white">
          <Trans>
            Big ups to the Ethereum community for crafting the infrastructure
            and economy to make Juicebox possible.
          </Trans>
        </p>
      </div>
      <div className="grid gap-y-5 bg-black p-7 text-center">
        <div className="mb-7 flex flex-wrap justify-center gap-y-2">
          {link('Contact', '/contact')}
          {link('Discord', 'https://discord.gg/6jXrJSyDFf')}
          {link('GitHub', 'https://github.com/jbx-protocol/juice-interface')}
          {link('Twitter', 'https://twitter.com/juiceboxETH')}
          {link('Privacy Policy', '/privacy')}
          {link('Terms of Service', TERMS_OF_SERVICE_URL)}
        </div>

        {gitCommit ? (
          <span className="text-white">
            Version:{' '}
            <ExternalLink href={gitCommitLink} className="text-sm">
              #{gitCommit}
            </ExternalLink>
          </span>
        ) : null}
      </div>
    </div>
  )
}
