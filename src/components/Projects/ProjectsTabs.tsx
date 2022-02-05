import { t } from '@lingui/macro'
import { Space } from 'antd'
import { NetworkContext } from 'contexts/networkContext'
import { ThemeContext } from 'contexts/themeContext'
import { ProjectCategory } from 'models/project-visibility'
import React, { useContext } from 'react'

export default function ProjectsTabs({
  selectedTab,
  setSelectedTab,
}: {
  selectedTab: ProjectCategory
  setSelectedTab: Function
}) {
  const { signingProvider } = useContext(NetworkContext)

  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const tab = (tab: ProjectCategory) => {
    let text: string = ''
    // Need this switch for translations
    switch (tab) {
      case 'all':
        text = t`All`
        break
      case 'myprojects':
        text = t`My projects`
        break
      case 'trending':
        text = t`Trending`
        break
    }
    return (
      <div
        style={{
          textTransform: 'uppercase',
          cursor: 'pointer',
          borderBottom: '2px solid transparent',
          paddingBottom: 6,
          ...(tab === selectedTab
            ? {
                color: colors.text.primary,
                fontWeight: 500,
                borderColor: colors.text.primary,
              }
            : {
                color: colors.text.secondary,
                borderColor: 'transparent',
              }),
        }}
        onClick={() => {
          window.location.href = `/#/projects?tab=${tab}`
          setSelectedTab(tab)
        }}
      >
        {text}
      </div>
    )
  }

  return (
    <div style={{ height: 40, marginTop: 15 }}>
      <Space direction="horizontal" size="large">
        {tab('trending')}
        {tab('all')}
        {signingProvider ? tab('myprojects') : null}
      </Space>
    </div>
  )
}
