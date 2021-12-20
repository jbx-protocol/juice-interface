import { Button } from 'antd'

import { useState, useMemo } from 'react'

import RichNote from '../Dashboard/ProjectActivity/RichNote'

export default function Paragraph({
  description,
  characterLimit,
}: {
  description: string
  characterLimit?: number
}) {
  const CHARACTER_LIMIT_EXCEEDED =
    characterLimit && description.length > characterLimit
  const [expanded, setExpanded] = useState<boolean>(false)
  const toggleExpanded = () => setExpanded(!expanded)

  const shortDescription = useMemo(
    () => `${description.slice(0, characterLimit).trim()}...`,
    [description, characterLimit],
  )

  return (
    <div>
      <RichNote
        style={{ maxWidth: '700px', display: 'inline' }} // good line length for reading
        note={
          !expanded && CHARACTER_LIMIT_EXCEEDED ? shortDescription : description
        }
      >
        {CHARACTER_LIMIT_EXCEEDED && (
          <Button
            type="link"
            style={{ padding: 0, paddingBottom: 0, height: 'auto' }}
            onClick={() => toggleExpanded()}
          >
            {expanded ? 'Read less' : 'Read more'}
          </Button>
        )}
      </RichNote>
    </div>
  )
}
