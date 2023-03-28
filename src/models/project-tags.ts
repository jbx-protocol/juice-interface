export const projectTagOptions = [
  'art',
  'business',
  'charity',
  'dao',
  'defi',
  'education',
  'events',
  'fundraising',
  'games',
  'music',
  'social',
] as const

export type ProjectTag = typeof projectTagOptions extends Readonly<
  Array<infer T>
>
  ? T
  : never

export const MAX_PROJECT_TAGS = 3
