import React from 'react'
import { padding } from '../../constants/styles/padding'

export default function ImgTextSection({
  img,
  imgPosition,
  text,
  title,
}: {
  img: string
  imgPosition: 'left' | 'right'
  text?: string[]
  title?: string
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
      ></img>
      <div>
        {title ? <h3>{title}</h3> : null}
        {text?.map(t => (
          <p>{t}</p>
        ))}
      </div>
    </div>
  )
}
