import axios from 'axios'
import FormattedAddress from 'components/shared/FormattedAddress'
import { ProjectVx } from 'models/subgraph-entities/project'
import { useEffect, useState } from 'react'
import { formatHistoricalDate } from 'utils/formatDate'
import { ipfsCidUrl } from 'utils/ipfs'

export default function ProjectCard({ project }: { project: ProjectVx }) {
  const [metadata, setMetadata] = useState()

  useEffect(() => {
    axios.get(ipfsCidUrl(project.metadataUri)).then(res => {
      setMetadata(res.data)
    })
  }, [project])

  return (
    <div>
      <a
        href={ipfsCidUrl(project.metadataUri)}
        target="_blank"
        rel="noopener noreferrer"
      >
        #{project.projectId}
      </a>{' '}
      - <FormattedAddress address={project.creator} /> -{' '}
      {formatHistoricalDate(project.createdAt * 1000)}
      {metadata && (
        <div>
          {Object.entries(metadata).map(([key, val]) =>
            val ? (
              <div>
                {key}: {JSON.stringify(val)}
              </div>
            ) : null,
          )}
        </div>
      )}
    </div>
  )
}
