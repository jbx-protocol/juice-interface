import { ForwardRefRenderFunction, forwardRef } from 'react'

// https://headlessui.com/react/menu#integrating-with-next-js
const PatchedExternalLink: ForwardRefRenderFunction<
  HTMLAnchorElement,
  React.HTMLProps<HTMLAnchorElement>
> = (props, ref) => {
  const { children } = props
  return (
    <a {...props} ref={ref} target="_blank" rel="noopener noreferrer">
      {children ? children : props.href}
    </a>
  )
}
export default forwardRef(PatchedExternalLink)
