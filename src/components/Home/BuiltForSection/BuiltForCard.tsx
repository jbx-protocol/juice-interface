import { BuiltForBlobAndImage } from 'components/Home/BuiltForSection/BuiltForBlobAndImage'

export function BuiltForCard({
  card,
  heading,
  subheading,
}: {
  card: 'daos' | 'crowdfunding' | 'nfts' | 'builders'
  heading: string | JSX.Element
  subheading: string | JSX.Element
}) {
  return (
    <div className="flex flex-col items-center">
      <BuiltForBlobAndImage card={card} />
      <h3 className="text-primary mt-5 whitespace-nowrap text-center text-2xl">
        {heading}
      </h3>
      <p className="text-center text-base text-grey-700 dark:text-slate-200">
        {subheading}
      </p>
    </div>
  )
}
