// import { useEf/fect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { loadURLContentType } from 'utils/http/loadURLContentType'

export function useContentType(uri?: string) {
  return useQuery({
    queryKey: ['content-type', uri],
    queryFn: async () => {
      return await loadURLContentType(uri)
    },
  })
}
