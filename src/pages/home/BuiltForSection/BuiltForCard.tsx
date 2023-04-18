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
    <div className="flex min-w-[270px] flex-1 flex-col items-center">
      <Image src={imageSrc ?? ''} alt={imageAlt} width={180} height={180} />
      <h6 className="mt-4 text-2xl">{heading}</h6>
      <p className="text-center text-base">{subheading}</p>
    </div>
  )
}
