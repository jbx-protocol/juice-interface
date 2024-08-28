import { DefaultBadge } from './DefaultBadge'
import { OptionalBadge } from './OptionalBadge'
import { RecommendedBadge } from './RecommendedBadge'
import { SkippedBadge } from './SkippedBadge'

export const CreateBadge = {
  Default: DefaultBadge,
  Skipped: SkippedBadge,
  Recommended: RecommendedBadge,
  Optional: OptionalBadge,
}
