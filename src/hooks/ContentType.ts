// import { useEf/fect, useState } from 'react'
import { useQuery } from 'react-query'
import { loadURLContentType } from 'utils/http/loadURLContentType'

export function useContentType(uri?: string) {
  return useQuery(
    ['content-type', uri],
    async () => {
      if (!uri) {
        throw new Error('Project URI not specified.')
      }

      const response = await loadURLContentType(uri)
      return response
    },
  )
}
