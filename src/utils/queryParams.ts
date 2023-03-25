export function formatQueryParams(
  obj:
    | Record<string, string | string[] | boolean | number | undefined>
    | undefined,
) {
  if (!obj) return ''

  return Object.entries(obj).reduce((acc, [k, v]) => {
    const vIsDefined = Array.isArray(v)
      ? v.length
      : ['string', 'number', 'boolean'].includes(typeof v)

    return (
      acc +
      (acc && vIsDefined ? '&' : '') +
      (vIsDefined ? `${k}=${Array.isArray(v) ? v.join(',') : v}` : '')
    )
  }, '')
}
