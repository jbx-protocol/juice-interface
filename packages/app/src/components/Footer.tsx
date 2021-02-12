import React from 'react'

import { colors } from '../constants/styles/colors'

export default function Footer() {
  const link = (text: string, link: string) => (
    <a
      style={{ color: colors.secondary, marginLeft: 10, marginRight: 10 }}
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
        {link('Discord', 'https://discord.gg/H8zcWNcM')}
        {link('Github', 'https://github.com/juice-work/juicehouse')}
        {link('Twitter', 'https://twitter.com/doworkgetjuice')}
        {link(
          'Medium',
          'https://joaoritter.medium.com/%EF%B8%8F-fountain-finance-1f2b5a33cb10',
        )}
      </div>
      <div style={{ color: 'white' }}>© 2021 Juice</div>
    </div>
  )
}
