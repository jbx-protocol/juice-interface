import { GlobalOutlined } from '@ant-design/icons'
import { Select } from 'antd'
import { Languages } from 'constants/languages/language-options'
import { useEffect, useState } from 'react'
import { reloadWindow } from 'utils/windowUtils'

// Language select tool seen in top nav
export default function NavLanguageSelector({
  disableLang,
  mobile,
}: {
  disableLang?: string
  mobile?: boolean
}) {
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

  let currentSelectedLanguage =
    (localStorage && localStorage.getItem('lang')) || 'en'

  // Sets the new language with localStorage and reloads the page
  const setLanguage = (newLanguage: string) => {
    if (localStorage) {
      currentSelectedLanguage = newLanguage
      localStorage.setItem('lang', newLanguage)
      reloadWindow()
    }
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
      // language-selector is antd override
      className="language-selector flex w-full cursor-pointer items-center"
      onClick={e => {
        e.stopPropagation()
        setDropdownOpen(!dropdownOpen)
      }}
    >
      <GlobalOutlined className="mb-0.5" />
      <Select
        className="flex cursor-pointer items-center justify-evenly font-medium"
        popupClassName={!mobile ? 'mr-5' : ''}
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
