import { Trans } from '@lingui/macro'
import { Button } from 'antd'
import ExternalLink from 'components/ExternalLink'
import { Languages } from 'constants/languages/language-options'
import { TERMS_OF_SERVICE_URL } from 'constants/links'
import { ThemeOption } from 'constants/theme/theme-option'
import { ThemeContext } from 'contexts/themeContext'
import Image from 'next/image'
import Link from 'next/link'
import { CSSProperties, useContext } from 'react'
import { reloadWindow, scrollToTop } from 'utils/windowUtils'
import orangeLadyOd from '/public/assets/orange_lady-od.png'
import orangeLadyOl from '/public/assets/orange_lady-ol.png'

export default function Footer() {
  const {
    theme: { colors },
    forThemeOption,
  } = useContext(ThemeContext)

  const footerLinksStyles: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    rowGap: 10,
    justifyContent: 'center',
    marginBottom: 30,
  }

  const link = (text: string, link: string) => {
    const style = {
      color: colors.text.action.primary,
      marginLeft: 10,
      marginRight: 10,
    }
    if (link.startsWith('http')) {
      return (
        <ExternalLink style={style} href={link}>
          {text}
        </ExternalLink>
      )
    }
    return (
      <Link href={link}>
        <a style={style}>{text}</a>
      </Link>
    )
  }

  // Renders language links
  const languageLink = (lang: string) => (
    <Button key={lang} onClick={() => setLanguage(lang)} type="link">
      {Languages[lang].long}
    </Button>
  )

  // Sets the new language with localStorage and reloads the page
  const setLanguage = (newLanguage: string) => {
    localStorage && localStorage.setItem('lang', newLanguage)
    reloadWindow()
    scrollToTop()
  }

  const gitCommit = process.env.NEXT_PUBLIC_VERSION
  const gitCommitLink = `https://github.com/jbx-protocol/juice-interface/commit/${gitCommit}`

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: -12,
        }}
      >
        <Image
          src={forThemeOption?.({
            [ThemeOption.dark]: orangeLadyOd,
            [ThemeOption.light]: orangeLadyOl,
          })}
          alt="Powerlifting orange hitting an olympic deadlift"
          loading="lazy"
        />
      </div>

      <div
        style={{
          background: 'black',
          padding: 40,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 20, marginBottom: 20 }}>🧃⚡️</div>
        <p style={{ color: 'white', margin: 0 }}>
          <Trans>
            Big ups to the Ethereum community for crafting the infrastructure
            and economy to make Juicebox possible.
          </Trans>
        </p>
      </div>
      <div
        style={{
          display: 'grid',
          rowGap: 20,
          padding: 30,
          background: 'black',
          textAlign: 'center',
        }}
      >
        <div style={{ ...footerLinksStyles }}>
          {Object.keys(Languages).map(languageLink)}
        </div>
        <div style={{ ...footerLinksStyles }}>
          {link('Discord', 'https://discord.gg/6jXrJSyDFf')}
          {link('GitHub', 'https://github.com/jbx-protocol/juice-interface')}
          {link('Twitter', 'https://twitter.com/juiceboxETH')}
          {link('Privacy Policy', '/privacy')}
          {link('Terms of Service', TERMS_OF_SERVICE_URL)}
        </div>

        {gitCommit ? (
          <span style={{ color: 'white' }}>
            Version:{' '}
            <ExternalLink href={gitCommitLink} style={{ fontSize: '0.8rem' }}>
              #{gitCommit}
            </ExternalLink>
          </span>
        ) : null}
      </div>
    </div>
  )
}
