import { ReactNode, ReactNodeArray } from 'react'

export const isReactNodeArray = (
  node: ReactNode | undefined,
): node is ReactNodeArray => {
  return node instanceof Array
}
