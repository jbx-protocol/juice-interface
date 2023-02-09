// import { useEf/fect, useState } from 'react'
import { useQuery } from 'react-query'
import { loadURLContentType } from 'utils/http/loadURLContentType'

export function useContentType(uri?: string) {
  return useQuery(['content-type', uri], async () => {
    return await loadURLContentType(uri)
  })
}
