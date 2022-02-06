export default function pluralize<S, P>(count: number, singular: S, plural: P) {
  if (count === 1) {
    return singular
  }

  return plural
}
