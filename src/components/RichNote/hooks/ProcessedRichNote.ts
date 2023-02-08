import { IPFS_LINK_REGEX } from 'constants/ipfs'
import { ProjectPreferences } from 'constants/projectPreferences'
import { useEffect, useMemo, useState } from 'react'
import { ipfsToHttps } from 'utils/ipfs'
import { loadAllMediaLinks } from './loadAllMediaLinks'

// Gets strings that start with 'https'
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
  // Add newline before any links (starts with 'https' or 'ipfs') in the note that don't already have them
  const noteParts = note?.split(/\s+/) ?? [] // split any whitespace (space or newline)
  const formattedNote =
    noteParts // split with space or newline
      .map(word => {
        if (word.match(IPFS_LINK_REGEX)) {
          return `\n${ipfsToHttps(word)}`
        } else if (word.match(URLRegex)) {
          return `\n${word}`
        }
        return word
      })
      .join(' ') ?? note

  const allLinks = useMemo(() => {
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
   * Loaded in the useEffect below when `loadAllMediaLinks` is loaded.
   */
  const [mediaLinks, setMediaLinks] = useState<string[]>()
  useEffect(() => {
    // loadAllMediaLinks does a more thorough check on each link than just regex .match()
    loadAllMediaLinks(allLinks).then((links: string[]) => {
      // Slice the links to allow only 3 images.
      setMediaLinks(links.slice(0, ProjectPreferences.MAX_IMAGES_PAYMENT_MEMO))
    })
  }, [allLinks])

  /*
   * Trimmed note based on the loaded media links (removes the image links' text from the note)
   */
  const trimmedNote = useMemo(() => {
    if (!mediaLinks || !formattedNote) return formattedNote
    // Checks each word of note and removes if it is a mediaLink
    let formattedNoteWords = formattedNote.split(/\s+/) // any whitespace
    formattedNoteWords = formattedNoteWords.filter(word => {
      return !mediaLinks.includes(word)
    })
    return formattedNoteWords.join(' ')
  }, [mediaLinks, formattedNote])

  return {
    trimmedNote,
    formattedMediaLinks: mediaLinks?.filter(i => Boolean(i)),
  }
}
