import Image from 'next/image'

export function BuiltForCard({
  imageSrc,
  imageAlt,
  heading,
  subheading,
}: {
  imageSrc: string | undefined
  imageAlt: string
  heading: string | JSX.Element
  subheading: string | JSX.Element
}) {
  return (
    <div className="flex w-[280px] flex-col items-center">
      <Image src={imageSrc ?? ''} alt={imageAlt} width={180} height={180} />
      <h3 className="text-primary mt-4 text-2xl">{heading}</h3>
      <p className="text-center text-base text-grey-700 dark:text-slate-200">
        {subheading}
      </p>
    </div>
  )
}
