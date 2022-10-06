export type ArrayElement<Type extends unknown[]> =
  Type extends readonly (infer ElementType)[] ? ElementType : never
