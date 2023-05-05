export const Parenthesis: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  if (!children) return null
  return <>({children})</>
}
