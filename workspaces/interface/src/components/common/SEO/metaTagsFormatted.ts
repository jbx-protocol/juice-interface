export function metaTagsFormatted<T>(props: T, prefix?: string) {
  if (!props || !Object.keys(props).length) return null

  return Object.entries(props)
    .map(([k, value]) => {
      if (!value) return null
      const key = k === '_root' ? prefix : `${prefix}:${k}`
      return value ? { key, value } : null
    })
    .filter((i): i is { key: string; value: string } => !!i)
}
