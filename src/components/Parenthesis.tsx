export const Parenthesis: React.FC = ({ children }) => {
  if (!children) return null
  return <>({children})</>
}
