import { t } from '@lingui/macro'
import { Button } from 'antd'
import RichNote from 'components/RichNote/RichNote'
import { useMemo, useState } from 'react'
import { twMerge } from 'tailwind-merge'

export default function Paragraph({
  className,
  description,
  characterLimit,
}: {
  className?: string
  description: string
  characterLimit?: number
}) {
  const CHARACTER_LIMIT_EXCEEDED =
    (characterLimit && description.length > characterLimit) ||
    description.split('\n').length > 3

  const [expanded, setExpanded] = useState<boolean>(false)
  const toggleExpanded = () => setExpanded(!expanded)

  // Apply character limit to first 3 lines
  const shortDescription = useMemo(() => {
    const allLines = description.split('\n')
    const firstThreeLines = allLines.slice(0, 3).join('\n')
    return `${firstThreeLines.slice(0, characterLimit).trim()}...`
  }, [characterLimit, description])

  return (
    <>
      <RichNote
        className={twMerge('inline max-w-2xl ', className)} // good line length for reading
        note={
          !expanded && CHARACTER_LIMIT_EXCEEDED ? shortDescription : description
        }
        ignoreMediaLinks
      >
        {CHARACTER_LIMIT_EXCEEDED && (
          <Button
            type="link"
            className="h-auto p-0 font-medium text-bluebs-600 dark:text-bluebs-500"
            onClick={e => {
              toggleExpanded()
              e.stopPropagation()
            }}
          >
            {expanded ? t`Read less` : t`Read more`}
          </Button>
        )}
      </RichNote>
    </>
  )
}
