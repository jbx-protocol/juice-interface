import { t } from '@lingui/macro'

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
  'nfts',
  'social',
  'software',
] as const

export const projectTagText: {
  [key in ProjectTagName]: () => string
} = {
  art: () => t`Art`,
  business: () => t`Business`,
  charity: () => t`Charity`,
  dao: () => t`DAO`,
  defi: () => t`DeFi`,
  education: () => t`Education`,
  events: () => t`Events`,
  fundraising: () => t`Fundraising`,
  games: () => t`Games`,
  music: () => t`Music`,
  nfts: () => t`NFT`,
  social: () => t`Social`,
  software: () => t`Software`,
}

export type ProjectTagName = typeof projectTagOptions extends Readonly<
  Array<infer T>
>
  ? T
  : never

export function isValidProjectTag(
  tag: ProjectTagName | string,
): tag is ProjectTagName {
  return projectTagOptions.includes(tag as ProjectTagName)
}

export function filterValidTags(tags: string[] | null | undefined) {
  return tags?.filter(isValidProjectTag).slice(0, MAX_PROJECT_TAGS)
}

export const MAX_PROJECT_TAGS = 3
