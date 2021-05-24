import { Layout } from 'antd'
import { Content } from 'antd/lib/layout/layout'
import { ThemeContext } from 'contexts/themeContext'
import { useJuiceTheme } from 'hooks/JuiceTheme'

import Navbar from './Navbar'
import Router from './Router'

function App() {
  const juiceTheme = useJuiceTheme()

  return (
    <ThemeContext.Provider value={juiceTheme}>
      <Layout
        className="App"
        style={{
          display: 'flex',
          flexDirection: 'column',
          height: '100%',
          background: 'transparent',
        }}
      >
        <Navbar />
        <Content>
          <Router />
        </Content>
      </Layout>
    </ThemeContext.Provider>
  )
}

export default App
