import { Button } from 'antd'
import RichNote from '../Dashboard/ProjectActivity/RichNote'
import { useState, useMemo } from 'react'

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
      />
      {CHARACTER_LIMIT_EXCEEDED && (
        <Button
          type="link"
          style={{ paddingTop: 0, paddingBottom: 0, height: 'auto' }}
          onClick={() => toggleExpanded()}
        >
          {expanded ? 'Read less' : 'Read more'}
        </Button>
      )}
    </div>
  )
}
