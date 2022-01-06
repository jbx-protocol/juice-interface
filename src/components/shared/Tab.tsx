import { Space } from 'antd'
import { ThemeContext } from 'contexts/themeContext'
import { createContext, useContext } from 'react'

const TabContext = createContext({
  selectedTab: '',
  setSelectedTab: (selection: string) => {},
})

export function Tab({
  text,
  value,
}: {
  /** Value used for setSelectedTab */
  value: string

  /** Display text, if different from [value] */
  text?: string
}) {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const { selectedTab, setSelectedTab } = useContext(TabContext)

  function setSelected() {
    setSelectedTab(value)
  }

  return (
    <div
      style={{
        textTransform: 'uppercase',
        cursor: 'pointer',
        borderBottom: '2px solid transparent',
        paddingBottom: 6,
        ...(selectedTab === value
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
      onClick={setSelected}
    >
      {text ?? value}
    </div>
  )
}

export function TabGroup({ children, value }: { children: any; value: any }) {
  return (
    <TabContext.Provider value={value}>
      <Space direction="horizontal" size="large">
        {children}
      </Space>
    </TabContext.Provider>
  )
}
