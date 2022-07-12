import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { CSSProperties } from 'react'
import { Button } from 'antd'
import ExternalLink from 'components/ExternalLink'

import { reloadWindow, scrollToTop } from 'utils/windowUtils'

import { Languages } from 'constants/languages/language-options'

export default function Footer() {
  const { colors } = useContext(ThemeContext).theme

  const footerLinksStyles: CSSProperties = {
    display: 'grid',
    rowGap: 10,
    justifyContent: 'center',
    marginBottom: 30,
  }

  const link = (text: string, link: string) => (
    <a
      style={{
        color: colors.text.action.primary,
        marginLeft: 10,
        marginRight: 10,
      }}
      href={link}
    >
      {text}
    </a>
  )

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

  const gitCommit = process.env.REACT_APP_VERSION
  const gitCommitLink = `https://github.com/jbx-protocol/juice-interface/commit/${gitCommit}`

  return (
    <div
      style={{
        display: 'grid',
        rowGap: 20,
        padding: 30,
        background: 'black',
        textAlign: 'center',
      }}
    >
      <div style={{ ...footerLinksStyles, display: 'flex', flexWrap: 'wrap' }}>
        {Object.keys(Languages).map(languageLink)}
      </div>
      <div style={{ ...footerLinksStyles, display: 'flex' }}>
        {link('Discord', 'https://discord.gg/6jXrJSyDFf')}
        {link('GitHub', 'https://github.com/jbx-protocol/juice-interface')}
        {link('Twitter', 'https://twitter.com/juiceboxETH')}
        {link('Privacy Policy', '/#/privacy')}
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
  )
}
