import { Button } from 'antd'
import { CaretDownOutlined, CaretUpOutlined } from '@ant-design/icons'
import RichNote from './ProjectActivity/RichNote'
import { useState, useMemo } from 'react'

const DEFAULT_CHARACTER_LIMIT = 250

export default function ProjectDescription({
  description,
}: {
  description: string
}) {
  const CHARACTER_LIMIT_EXCEEDED = description.length > DEFAULT_CHARACTER_LIMIT
  const [expanded, setExpanded] = useState<boolean>(false)
  const toggleExpanded = () => setExpanded(!expanded)

  const shortDescription = useMemo(
    () => `${description.slice(0, DEFAULT_CHARACTER_LIMIT).trim()}...`,
    [description],
  )

  return (
    <div>
      <RichNote
        style={{ maxWidth: '700px', display: 'inline' }} // good line length for reading
        note={
          !expanded && CHARACTER_LIMIT_EXCEEDED ? shortDescription : description
        }
      />
      {CHARACTER_LIMIT_EXCEEDED && (
        <Button
          type="link"
          style={{ paddingTop: 0, paddingBottom: 0, height: 'auto' }}
          icon={expanded ? <CaretUpOutlined /> : <CaretDownOutlined />}
          onClick={() => toggleExpanded()}
        >
          {expanded ? 'Read less' : 'Read more'}
        </Button>
      )}
    </div>
  )
}
