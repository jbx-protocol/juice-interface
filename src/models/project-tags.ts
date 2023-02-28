export const projectTagOptions = [
'art',
'dao',
'defi',
'education',
'fundraising',
'games',
'grants',
'infrastructure',
'music',
'revenue',
'social',
] as const

export type ProjectTag = typeof projectTagOptions extends Readonly<
  Array<infer T>
>
  ? T
  : never

export const MAX_PROJECT_TAGS = 3
