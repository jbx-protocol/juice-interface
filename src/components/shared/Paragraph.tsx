import { Button } from 'antd'

import { useState, useMemo } from 'react'

import RichNote from './RichNote'

export default function Paragraph({
  description,
  characterLimit,
}: {
  description: string
  characterLimit?: number
}) {
  const CHARACTER_LIMIT_EXCEEDED =
    (characterLimit && description.length > characterLimit) ||
    description.split('\n').length > 3

  const [expanded, setExpanded] = useState<boolean>(false)
  const toggleExpanded = () => setExpanded(!expanded)

  const allLines = description.split('\n')
  let firstThreeLines = ''

  // Truncate the first 3 lines of the description
  allLines.forEach((line, index) => {
    console.info(`Line: ${line}, index: ${index}`)
    if (index < allLines.length && index < 3) {
      firstThreeLines = firstThreeLines.concat(`${line}\n`)
    }
  })

  // Apply character limit to first 3 lines
  const shortDescription = useMemo(
    () => `${firstThreeLines.slice(0, characterLimit).trim()}...`,
    [characterLimit, firstThreeLines],
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
