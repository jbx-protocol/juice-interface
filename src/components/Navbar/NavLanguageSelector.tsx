import { GlobalOutlined } from '@ant-design/icons'
import { Select } from 'antd'
import { CSSProperties, useEffect, useState } from 'react'

import { reloadWindow, safeLocalStorage } from 'utils/windowUtils'

import { Languages } from 'constants/languages/language-options'

// Language select tool seen in top nav
export default function NavLanguageSelector({
  disableLang,
  mobile,
}: {
  disableLang?: string
  mobile?: boolean
}) {
  const selectStyle: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    cursor: 'pointer',
    fontWeight: 500,
  }

  const [dropdownOpen, setDropdownOpen] = useState<boolean>(false)

  // Renders Select Option for each language available on Juicebox
  const renderLanguageOption = (lang: string) => {
    if (disableLang === lang) {
      return null
    }
    return (
      <Select.Option key={lang} value={lang}>
        <div>{mobile ? Languages[lang].long : Languages[lang].short}</div>
      </Select.Option>
    )
  }

  let currentSelectedLanguage = safeLocalStorage?.getItem('lang') || 'en'

  // Sets the new language with localStorage and reloads the page
  const setLanguage = (newLanguage: string) => {
    if (safeLocalStorage) {
      currentSelectedLanguage = newLanguage
      safeLocalStorage.setItem('lang', newLanguage)
      reloadWindow()
    }
  }

  const desktopDropdownStyle: CSSProperties = {
    marginRight: 20,
  }

  const selectHeader = mobile
    ? Languages[currentSelectedLanguage].long
    : Languages[currentSelectedLanguage].short

  // Close dropdown when clicking anywhere in the window except the collapse items
  useEffect(() => {
    function handleClick() {
      setDropdownOpen(false)
    }
    window.addEventListener('click', handleClick)
    return () => window.removeEventListener('click', handleClick)
  }, [])

  return (
    <div
      className="language-selector"
      style={{ cursor: 'pointer' }}
      onClick={e => {
        e.stopPropagation()
        setDropdownOpen(!dropdownOpen)
      }}
    >
      <GlobalOutlined style={{ marginBottom: 2 }} />
      <Select
        className="medium"
        style={{
          ...selectStyle,
        }}
        dropdownStyle={mobile ? {} : desktopDropdownStyle}
        open={dropdownOpen}
        value={selectHeader ?? 'EN'}
        onChange={newLanguage => {
          setLanguage(newLanguage)
        }}
        dropdownMatchSelectWidth={false}
      >
        {Object.keys(Languages).map(renderLanguageOption)}
      </Select>
    </div>
  )
}
