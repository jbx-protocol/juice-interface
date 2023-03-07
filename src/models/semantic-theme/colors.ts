import { Property } from 'csstype'

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace SemanticColor {
  export type Primary = { primary: Property.Color }
  export type Secondary = { secondary: Property.Color }
  export type Tertiary = { tertiary: Property.Color }
  export type Success = { success: Property.Color }
  export type Action = { action: Primary }
  export type ActionHighlight = {
    action: Primary
  }
  export type Brand = { brand: Primary }
}

export interface SemanticColors {
  text: SemanticColor.Primary & SemanticColor.Tertiary & SemanticColor.Brand
  stroke: SemanticColor.Primary &
    SemanticColor.Secondary &
    SemanticColor.Tertiary
  background: SemanticColor.ActionHighlight
}
