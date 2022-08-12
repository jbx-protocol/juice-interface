// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isDefined(condition: any): asserts condition {
  if (condition === undefined || condition === null || condition === false) {
    throw new Error(
      `Expected 'condition' to be defined, but received ${condition}`,
    )
  }
}
