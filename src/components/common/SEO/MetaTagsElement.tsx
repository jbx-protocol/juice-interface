export function MetaTagsElement<T>(props: T, prefix?: string) {
  if (!props || !Object.keys(props).length) return null

  return (
    <>
      {Object.entries(props).map(([k, value]) => {
        if (!value) return null
        const key = k === '_root' ? prefix : `${prefix}:${k}`
        return value ? <meta key={key} name={key} content={value} /> : null
      })}
    </>
  )
}
