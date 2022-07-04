export default function ExternalLink({
  children,
  ...props
}: React.HTMLProps<HTMLAnchorElement>) {
  return (
    <a {...props} target="_blank" rel="noopener noreferrer">
      {children}
    </a>
  )
}
