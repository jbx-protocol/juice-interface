import React from 'react'

export default function ImgTextSection({
  img,
  imgPosition,
  text,
  title,
  alt,
}: {
  img: string
  imgPosition: 'left' | 'right'
  text?: string[]
  title?: string
  alt?: string
}) {
  const padding = 40

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        alignItems: 'center',
        columnGap: padding,
        paddingTop: padding,
        paddingBottom: padding,
      }}
    >
      <img
        style={{
          maxWidth: 300,
          maxHeight: 400,
          gridColumnStart: imgPosition === 'right' ? 2 : 1,
        }}
        src={img}
        alt={alt}
      ></img>
      <div>
        {title ? <h3>{title}</h3> : null}
        {text?.map((t, i) => (
          <p key={i}>{t}</p>
        ))}
      </div>
    </div>
  )
}
