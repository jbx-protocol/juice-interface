import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'
import { CSSProperties } from 'react'

import { Languages } from 'constants/languages/language-options'
import V2Switch from './V2Switch'

export default function Footer() {
  const { colors } = useContext(ThemeContext).theme

  const footerLinksStyles: CSSProperties = {
    display: 'grid',
    rowGap: 10,
    justifyContent: 'center',
    marginBottom: 30,
  }

  const link = (text: string, link?: string) => (
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
    <span key={lang} onClick={() => setLanguage(lang)}>
      {link(Languages[lang].long)}
    </span>
  )

  // Sets the new language with localStorage and reloads the page
  const setLanguage = (newLanguage: string) => {
    localStorage.setItem('lang', newLanguage)
    window.location.reload()
    window.scrollTo(0, 0) // scroll to top of page after reload
  }

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
      <div style={footerLinksStyles}>
        {Object.keys(Languages).map(languageLink)}
      </div>
      <div style={{ ...footerLinksStyles, display: 'flex' }}>
        {link('Discord', 'https://discord.gg/6jXrJSyDFf')}
        {link('GitHub', 'https://github.com/jbx-protocol/juice-interface')}
        {link('Twitter', 'https://twitter.com/juiceboxETH')}
      </div>
      <div style={{ display: 'flex', margin: 'auto' }}>
        <V2Switch />
      </div>
    </div>
  )
}
