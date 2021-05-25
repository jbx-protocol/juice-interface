import Axios from 'axios'
import { ProjectMetadata } from 'models/project-metadata'
import { useEffect, useState } from 'react'

export function useProjectMetadata(link: string | undefined) {
  const [metadata, setMetadata] = useState<ProjectMetadata>()

  const getMetadata = async (url: string) => {
    try {
      await Axios.get(url).then(res => setMetadata(res.data))
    } catch (e) {
      console.error('Error getting metadata for link', link, e)
    }
  }

  useEffect(() => {
    link && getMetadata(link)
  }, [link])

  return metadata
}
