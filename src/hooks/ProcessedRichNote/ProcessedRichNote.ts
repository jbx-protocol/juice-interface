import { useEffect, useMemo, useState } from 'react'
import { formatIpfsLink } from 'utils/ipfs'

import { ProjectPreferences } from 'constants/v2/projectPreferences'
import { loadAllMediaLinksPerLine } from './loadAllMediaLinksPerLine'

// Gets strings that start with 'https'
const URLRegex = new RegExp(
  /((?:https?):\/\/(?:\w+:?\w*)?(?:\S+)(:\d+)?(?:\/|\/([\w#!:.?+=&%!\-/]))?)/gi,
)

// Gets strings that start with 'ipfs'
const ipfsLinkRegex = new RegExp(
  /((?:ipfs?):\/\/(?:\w+:?\w*)?(?:\S+)(:\d+)?(?:\/|\/([\w#!:.?+=&%!\-/]))?)/gi,
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
  // Add newline before any links (starts with 'https' or 'ipfs') in the note that don't already have them
  const noteParts = note?.split(/\s+/) ?? [] // split any whitespace (space or newline)
  const formattedNote =
    noteParts // split with space or newline
      .map(word => {
        if (word.match(ipfsLinkRegex)) {
          return `\n${formatIpfsLink(word)}`
        } else if (word.match(URLRegex)) {
          return `\n${word}`
        }
        return word
      })
      .join(' ') ?? note

  const linksPerLine = useMemo(() => {
    // split from new line OR space
    const linksArray = formattedNote
      ?.split('\n')
      .map(line => {
        if (line.match(URLRegex)) {
          return line.replace(/\s/g, '') //remove any whitespace
        }
        return ''
      })
      .filter(line => line)

    if (linksArray && linksArray[0]) {
      return linksArray
    }
    return []
  }, [formattedNote])

  /*
   * Loaded in the useEffect below when `linksPerLine` is set.
   */
  const [mediaLinksPerLine, setMediaLinksPerLine] =
    useState<Array<string[] | undefined>>()
  useEffect(() => {
    loadAllMediaLinksPerLine(linksPerLine).then(mediaLinksPerLine => {
      // Slice the links to allow only 3 images per line.
      mediaLinksPerLine = mediaLinksPerLine.map(line =>
        line?.slice(0, ProjectPreferences.STICKER_MAX),
      )
      setMediaLinksPerLine(mediaLinksPerLine)
    })
  }, [linksPerLine])

  /*
   * Trimmed note based on the loaded media links (removes the image links' text from the note)
   */
  const trimmedNote = useMemo(() => {
    if (!mediaLinksPerLine || !formattedNote) return formattedNote
    // Checks each word of note and removes if it is a mediaLink
    let formattedNoteWords = formattedNote.split(/\s+/) // any whitespace
    mediaLinksPerLine.forEach(links => {
      if (!links) return
      formattedNoteWords = formattedNoteWords.filter(word => {
        return !links.includes(word)
      })
    })
    return formattedNoteWords.join(' ')
  }, [mediaLinksPerLine, formattedNote])

  return {
    trimmedNote,
    formattedMediaLinks: mediaLinksPerLine?.filter((i): i is string[] => !!i),
  }
}
