import { Layout, Menu, MenuProps } from 'antd'
const { Content, Sider } = Layout

type MenuItem = Required<MenuProps>['items'][number]

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem
}

const items: MenuItem[] = [
  getItem('Project', 'project', undefined, [
    getItem('General', 'project1'),
    getItem('Project handle', 'project2'),
  ]),
  getItem('Funding', 'funding', undefined, [
    getItem('Funding cycle', 'funding1'),
    getItem('Payouts', 'funding2'),
    getItem('Reserved tokens', 'funding3'),
  ]),
  getItem('Manage', 'manage', undefined, [
    getItem('Payment addresses', 'manage1'),
    getItem('V1 token migration', 'manage2'),
    getItem('veNFT', 'manage3'),
  ]),
]

const V2ProjectSettings = () => {
  return (
    <Layout style={{ minHeight: '100vh', background: 'transparent' }}>
      <Sider style={{ background: 'transparent' }}>
        <div className="logo" />
        <Menu
          defaultOpenKeys={['project', 'funding', 'manage']}
          mode="inline"
          items={items}
        />
      </Sider>
      <Layout style={{ background: 'transparent' }}>
        <Content style={{ margin: '0 16px' }}>
          <div style={{ padding: 24, minHeight: 360 }}>Content</div>
        </Content>
      </Layout>
    </Layout>
  )
}

export default V2ProjectSettings
