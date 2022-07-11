import { useEffect, useMemo, useState } from 'react'

import { loadAllMediaLinksPerLine } from './loadAllMediaLinksPerLine'

const URLRegex = new RegExp(
  /((?:https?):\/\/(?:\w+:?\w*)?(?:\S+)(:\d+)?(?:\/|\/([\w#!:.?+=&%!\-/]))?)/gi,
)

/**
 * Processes a RichNote contents, extracting any image data.
 *
 * @returns trimmedNote A note with images removed.
 * @returns formattedMediaLinks Any images extracted as urls.
 */
export const useProcessedRichNote = (note: string | undefined) => {
  /*
   * Links (irrespective of type) that are listed on each line.
   *
   * Format looks like [
   *   [www.example.com, www.juicebox.money],
   *   [www.wikipedia.org],
   * ]
   */
  const linksPerLine = useMemo(() => {
    return note?.split('\n').map(line => line.match(URLRegex)) ?? []
  }, [note])

  /*
   * Loaded in the useEffect below when `linksPerLine` is set.
   */
  const [mediaLinksPerLine, setMediaLinksPerLine] =
    useState<Array<string[] | undefined>>()
  useEffect(() => {
    loadAllMediaLinksPerLine(linksPerLine).then(mediaLinksPerLine =>
      setMediaLinksPerLine(mediaLinksPerLine),
    )
  }, [linksPerLine])

  /*
   * Trimmed note based on the loaded media links.
   */
  const trimmedNote = useMemo(() => {
    if (!mediaLinksPerLine || !note) return note

    const editedMemoLines: string[] = note.split('\n')
    mediaLinksPerLine.forEach((links, line) => {
      if (!links) return
      links.forEach(link => {
        editedMemoLines[line] = editedMemoLines[line].replace(link, '')
      })
    })
    return editedMemoLines.filter(line => /\S/.test(line)).join('\n')
  }, [mediaLinksPerLine, note])

  return {
    trimmedNote,
    formattedMediaLinks: mediaLinksPerLine?.filter((i): i is string[] => !!i),
  }
}
