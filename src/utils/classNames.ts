/**
 * Combines multiple class names into a single string.
 *
 * @param classes - An array of class names to combine.
 * @returns A string containing all the class names.
 *
 * @deprecated Prefer twMerge or twJoin instead.
 */
export function classNames(...classes: (string | undefined)[]) {
  return classes.filter(Boolean).join(' ')
}
