import Link, { LinkProps } from 'next/link'
import { ForwardRefRenderFunction, forwardRef } from 'react'

type PatchedNextLinkProps = LinkProps & {
  children: React.ReactNode
  className?: string
}

// https://headlessui.com/react/menu#integrating-with-next-js
const PatchedNextLink: ForwardRefRenderFunction<
  HTMLAnchorElement,
  PatchedNextLinkProps
> = (props, ref) => {
  const { href, children, className, ...rest } = props
  return (
    <Link href={href} className={className} ref={ref} {...rest}>
      {children}
    </Link>
  )
}
export default forwardRef(PatchedNextLink)
