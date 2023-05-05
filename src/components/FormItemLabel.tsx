const FormItemLabel: React.FC<React.PropsWithChildren<unknown>> = ({
  children,
}) => {
  return <h3 className="mr-4 text-black dark:text-slate-100">{children}</h3>
}

export default FormItemLabel
