import { Property } from 'csstype'

// eslint-disable-next-line @typescript-eslint/no-namespace
namespace SemanticColor {
  export type Primary = { primary: Property.Color }
  export type Secondary = { secondary: Property.Color }
  export type Tertiary = { tertiary: Property.Color }
  export type Success = { success: Property.Color }
  export type Warn = { warn: Property.Color }
  export type Failure = { failure: Property.Color }
  export type Action = { action: Primary & Secondary }
  export type ActionHighlight = {
    action: Primary & Secondary & { highlight: Property.Color }
  }
  export type Brand = { brand: Primary & Secondary }
  export type Status = Success & Warn & Failure
  export type Disabled = { disabled: Property.Color }
  export type Placeholder = { placeholder: Property.Color }
  export type Over = { over: ActionHighlight & Brand & Status & Disabled }
}

export interface SemanticColors {
  text: SemanticColor.Primary &
    SemanticColor.Secondary &
    SemanticColor.Tertiary &
    SemanticColor.Status &
    SemanticColor.Brand &
    SemanticColor.ActionHighlight &
    SemanticColor.Disabled &
    SemanticColor.Placeholder &
    SemanticColor.Over & { header: Property.Color }
  icon: SemanticColor.Primary &
    SemanticColor.Secondary &
    SemanticColor.Tertiary &
    SemanticColor.Status &
    SemanticColor.Brand &
    SemanticColor.Action &
    SemanticColor.Disabled &
    SemanticColor.Over
  stroke: SemanticColor.Primary &
    SemanticColor.Secondary &
    SemanticColor.Tertiary &
    SemanticColor.Status &
    SemanticColor.ActionHighlight &
    SemanticColor.Disabled
  background: SemanticColor.Status &
    SemanticColor.Brand &
    SemanticColor.ActionHighlight &
    SemanticColor.Disabled &
    Record<'l0' | 'l1' | 'l2', Property.Color>
  boxShadow: SemanticColor.Primary
}
