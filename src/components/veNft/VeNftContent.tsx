import { Divider, Layout } from 'antd'
import MintVeNftContent from 'components/veNft/MintVeNftContent'
import MyVeNftsContent from 'components/veNft/MyVeNftsContent'
import { V2VeNftPageKey, V2VeNftPageKeyTitleMap } from 'components/veNft/VeNft'
import { useRouter } from 'next/router'
import { useMemo } from 'react'

const VeNftPageComponents: { [k in V2VeNftPageKey]: () => JSX.Element } = {
  mint: MintVeNftContent,
  myvenfts: MyVeNftsContent,
}

const DEFAULT_SETTINGS_PAGE = 'mint'

export function VeNftContent() {
  const router = useRouter()

  const activePage =
    (router.query.page as V2VeNftPageKey) ?? DEFAULT_SETTINGS_PAGE
  const ActiveSettingsPage = useMemo(
    () => VeNftPageComponents[activePage],
    [activePage],
  )

  return (
    <Layout className="bg-transparent">
      <h2 className="mb-0 text-black dark:text-slate-100">
        {V2VeNftPageKeyTitleMap[activePage]}
      </h2>

      <Divider />

      <Layout.Content className="my-0 mx-4">
        <ActiveSettingsPage />
      </Layout.Content>
    </Layout>
  )
}
