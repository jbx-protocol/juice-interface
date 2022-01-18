import React, { CSSProperties } from 'react'
import { Select } from 'antd'
import { GlobalOutlined } from '@ant-design/icons'

import { Languages } from 'constants/languages/language-options'

// Language select tool seen in top nav
export default function LanguageSelector({
  disableLang,
}: {
  disableLang?: string
}) {
  const selectStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    cursor: 'pointer',
    height: 30,
    fontWeight: 500,
  }

  // Renders Select Option for each language available on Juicebox
  const renderLanguageOption = (lang: string) => {
    if (disableLang === lang) {
      return null
    }
    return (
      <Select.Option class="language-select-option" value={lang}>
        <div>{Languages[lang].long}</div>
      </Select.Option>
    )
  }

  let currentSelectedLanguage = localStorage.getItem('lang') || 'en'

  // Sets the new language with localStorage and reloads the page
  const setLanguage = (newLanguage: string) => {
    currentSelectedLanguage = newLanguage
    localStorage.setItem('lang', newLanguage)
    window.location.reload()
  }

  return (
    <div className="language-selector">
      <GlobalOutlined />
      <Select
        className="medium"
        style={{
          ...selectStyle,
        }}
        value={Languages[currentSelectedLanguage]?.long ?? 'English'}
        onChange={newLanguage => {
          setLanguage(newLanguage)
        }}
      >
        {Object.keys(Languages).map(renderLanguageOption)}
      </Select>
    </div>
  )
}
