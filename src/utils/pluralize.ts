import { i18n } from '@lingui/core'

// Uses i18n plural
export default function pluralize<S, P>(count: number, singular: S, plural: P) {
  return i18n._(`{count, plural, one {# ${singular}} other {# ${plural}}}`, {
    count,
  })
}
