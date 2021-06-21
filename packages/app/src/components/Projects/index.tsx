import { Button, Input, Select, Space } from 'antd'
import Loading from 'components/shared/Loading'
import ProjectsGrid from 'components/shared/ProjectsGrid'
import { layouts } from 'constants/styles/layouts'
import { UserContext } from 'contexts/userContext'
import { useProjects } from 'hooks/Projects'
import { useContext, useLayoutEffect, useState } from 'react'
import { useParams } from 'react-router'
import { Link } from 'react-router-dom'

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

  const projects = useProjects({ owner })

  return (
    <div style={{ ...layouts.maxWidth }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'baseline',
        }}
      >
        <h1>Projects on Juice</h1>
        <Space>
          <Select
            value={selectOption}
            onChange={val => {
              switch (val) {
                case 'all':
                  goToOwner('')
                  break
                case 'user':
                  userAddress && goToOwner(userAddress)
                  break
                case 'address':
                  setShowAddressInput(true)
                  setSelectOption('address')
                  break
              }
            }}
            style={{ width: 160 }}
          >
            <Select.Option value="all">All projects</Select.Option>
            <Select.Option value="user">Your projects</Select.Option>
            <Select.Option value="address">By owner</Select.Option>
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

      <div style={{ marginBottom: 40 }}>
        <Button onClick={() => (window.location.hash = 'create')} size="small">
          Create a project
        </Button>
      </div>

      {!projects ? (
        <Loading />
      ) : projects.length ? (
        <ProjectsGrid projects={projects} />
      ) : (
        <div style={{ padding: 40, textAlign: 'center' }}>
          No projects owned by {owner}
        </div>
      )}
    </div>
  )
}
