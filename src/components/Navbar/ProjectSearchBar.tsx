import { t } from '@lingui/macro'
import { Input } from 'antd'
import { useRouter } from 'next/router'

export const ProjectSearchBar = () => {
  const router = useRouter()
  return (
    <Input.Search
      allowClear
      placeholder={t`Search projects`}
      onSearch={val => {
        if (val) {
          router.push(`/projects?tab=all&search=${val}`)
        }
      }}
    />
  )
}
