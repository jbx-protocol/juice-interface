import { Divider, Layout } from 'antd'
import MintVeNftContent from 'components/veNft/MintVeNftContent'
import MyVeNftsContent from 'components/veNft/MyVeNftsContent'
import { V2VeNftPageKeyTitleMap } from 'components/veNft/VeNft'
import { ThemeContext } from 'contexts/themeContext'
import { V2VeNftPageKey } from 'models/menu-keys'
import { useRouter } from 'next/router'
import { useContext, useMemo } from 'react'

const VeNftPageComponents: { [k in V2VeNftPageKey]: () => JSX.Element } = {
  mint: MintVeNftContent,
  myvenfts: MyVeNftsContent,
}

const DEFAULT_SETTINGS_PAGE = 'mint'

export function VeNftContent() {
  const {
    theme: { colors },
  } = useContext(ThemeContext)

  const router = useRouter()

  const activePage =
    (router.query.page as V2VeNftPageKey) ?? DEFAULT_SETTINGS_PAGE
  const ActiveSettingsPage = useMemo(
    () => VeNftPageComponents[activePage],
    [activePage],
  )

  return (
    <Layout style={{ background: 'transparent' }}>
      <h2 style={{ color: colors.text.primary, marginBottom: 0 }}>
        {V2VeNftPageKeyTitleMap[activePage]}
      </h2>

      <Divider />

      <Layout.Content style={{ margin: '0 16px' }}>
        <ActiveSettingsPage />
      </Layout.Content>
    </Layout>
  )
}
