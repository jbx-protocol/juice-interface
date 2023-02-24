export const DrawSection: React.FC = ({ children }) => {
  return (
    <section className="mb-2 rounded-sm bg-smoke-75 stroke-none p-8 text-black shadow-[10px_10px_0px_0px_#E7E3DC] dark:bg-slate-400 dark:text-slate-100 dark:shadow-[10px_10px_0px_0px_#2D293A]">
      {children}
    </section>
  )
}
