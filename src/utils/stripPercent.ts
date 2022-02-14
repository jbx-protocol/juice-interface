// Strips '%'s from strings. Used in form items such as reserved rate and discount
export default function stripPercent(val: any) {
  // Only execute for strings else return what was passed
  if (typeof val === 'string' || val instanceof String) {
    return val?.replace('%' ?? '', '')
  }
  return val
}
