import { DefaultBadge } from './DefaultBadge'
import { OptionalBadge } from './OptionalBadge'
import { RecommendedBadge } from './RecommendedBadge'

export * from './RecommendedBadge'

export const CreateBadge = {
  Default: DefaultBadge,
  Recommended: RecommendedBadge,
  Optional: OptionalBadge,
}
