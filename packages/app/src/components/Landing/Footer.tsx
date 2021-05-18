import { ThemeContext } from 'contexts/themeContext'
import { useContext } from 'react'

export default function Footer() {
  const { colors } = useContext(ThemeContext).theme

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
      <div style={{ display: 'inline-flex', justifyContent: 'center' }}>
        {link('Discord', 'https://discord.gg/6jXrJSyDFf')}
        {link('Github', 'https://github.com/juice-work/juicehouse')}
        {link('Twitter', 'https://twitter.com/doworkgetjuice')}
      </div>
    </div>
  )
}
