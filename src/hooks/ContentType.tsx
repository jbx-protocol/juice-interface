import axios from 'axios'
import { useEffect, useState } from 'react'

export function useContentType(link?: string) {
  const [contentType, setContentType] = useState<string>()

  useEffect(() => {
    if (link) {
      axios
        .get(link)
        .then(res => setContentType(res.headers['content-type']))
        .catch(() => setContentType(undefined))
    } else {
      setContentType(undefined)
    }
  }, [link])

  return contentType
}
