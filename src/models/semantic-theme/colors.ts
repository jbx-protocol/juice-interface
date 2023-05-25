import { Property } from 'csstype'

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace SemanticColor {
  export type Primary = { primary: Property.Color }
  export type Secondary = { secondary: Property.Color }
  export type Tertiary = { tertiary: Property.Color }
}

export interface SemanticColors {
  stroke: SemanticColor.Primary &
    SemanticColor.Secondary &
    SemanticColor.Tertiary
}
