import { Input, Select, Space } from 'antd'
import { Option } from 'antd/lib/mentions'
import Loading from 'components/shared/Loading'
import ProjectsGrid from 'components/shared/ProjectsGrid'
import { layouts } from 'constants/styles/layouts'
import { UserContext } from 'contexts/userContext'
import { useProjects } from 'hooks/Projects'
import { useContext, useLayoutEffect, useState } from 'react'
import { useParams } from 'react-router'

type SelectOption = 'all' | 'user' | 'address'

export default function Projects() {
  const [selectOption, setSelectOption] = useState<SelectOption>()
  const [showAddressInput, setShowAddressInput] = useState<boolean>(false)
  const { userAddress } = useContext(UserContext)
  const { owner }: { owner?: string } = useParams()

  useLayoutEffect(() => {
    setShowAddressInput(owner !== undefined && owner !== userAddress)
    setSelectOption(
      owner ? (owner === userAddress ? 'user' : 'address') : 'all',
    )
  }, [owner, userAddress, setShowAddressInput, setSelectOption])

  function goToOwner(addr: string) {
    window.location.hash = addr ? '/projects/' + addr : '/projects'
  }

  const projects = useProjects(owner || false)

  if (!selectOption || !projects) return <Loading />

  return (
    <div style={{ ...layouts.maxWidth }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
          marginBottom: 40,
        }}
      >
        <h1>Projects on Juice</h1>
        <Space>
          <Select
            value={selectOption}
            onChange={val => {
              setShowAddressInput(val === 'address')
              switch (val) {
                case 'all':
                  goToOwner('')
                  break
                case 'user':
                  userAddress && goToOwner(userAddress)
                  break
              }
            }}
            style={{ width: 160 }}
          >
            <Option value="all">All projects</Option>
            <Option value="user">Your projects</Option>
            <Option value="address">By owner</Option>
          </Select>
          {showAddressInput && (
            <Input
              defaultValue={owner || ''}
              style={{ width: 400 }}
              placeholder="0x000000..."
              onKeyUp={e => {
                e.key === 'Enter' && goToOwner(e.currentTarget.value)
              }}
            />
          )}
        </Space>
      </div>
      {Object.values(projects).length ? (
        <ProjectsGrid projects={Object.values(projects)} />
      ) : (
        <div style={{ padding: 40, textAlign: 'center', fontStyle: 'italic' }}>
          No projects owned by {owner}
        </div>
      )}
    </div>
  )
}
