import { useEffect, useState } from 'react'
import { loadURLContentType } from 'utils/http/loadURLContentType'

export function useContentType(link?: string) {
  const [contentType, setContentType] = useState<string>()

  useEffect(() => {
    loadURLContentType(link).then(type => setContentType(type))
  }, [link])

  return contentType
}
