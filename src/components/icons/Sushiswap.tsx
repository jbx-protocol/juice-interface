type Props = {
  size?: number
}

export default function SushiswapLogo({ size }: Props): JSX.Element {
  const widthToHeight = 24 / 24
  const height = size ?? 24

  return (
    <svg
      style={{ height: `${height}px`, width: `${widthToHeight * height}px` }}
      width="24"
      height="24"
      enableBackground="new 0 0 24 24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
    >
      <clipPath id="a">
        <path d="m0 0h24v24h-24z" />
      </clipPath>
      <linearGradient id="b">
        <stop offset="0" stop-color="#03b8ff" />
        <stop offset="1" stop-color="#fa52a0" />
      </linearGradient>
      <linearGradient
        id="c"
        gradientTransform="matrix(1 0 0 -1 -12 1012)"
        gradientUnits="userSpaceOnUse"
        x1="20.6442"
        x2="24.3328"
        xlinkHref="#b"
        y1="1011.5057"
        y2="998.8395"
      />
      <linearGradient
        id="d"
        gradientTransform="matrix(1 0 0 -1 -12 1012)"
        gradientUnits="userSpaceOnUse"
        x1="23.6818"
        x2="27.3705"
        xlinkHref="#b"
        y1="1012.3904"
        y2="999.7241"
      />
      <linearGradient
        id="e"
        gradientTransform="matrix(1 0 0 -1 -12 1012)"
        gradientUnits="userSpaceOnUse"
        x1="17.616"
        x2="21.3047"
        xlinkHref="#b"
        y1="1010.6239"
        y2="997.9576"
      />
      <g clip-path="url(#a)">
        <path d="m5 2.3 18.6 12.7-4.6 6.8-18.6-12.8z" fill="url(#c)" />
        <path
          d="m23.6 15c-1.6 2.3-7 1.4-12.1-2.2-5.2-3.5-8-8.2-6.5-10.5 1.6-2.3 7-1.4 12.1 2.2 5.2 3.4 8 8.2 6.5 10.5z"
          fill="url(#d)"
        />
        <path
          d="m19 21.7c-1.6 2.3-7 1.4-12.1-2.2s-8-8.2-6.4-10.6c1.6-2.3 7-1.4 12.1 2.2s7.9 8.3 6.4 10.6z"
          fill="url(#e)"
        />
        <path
          d="m23.6 15-4.6 6.8c-1.6 2.3-7 1.3-12.1-2.2-1-.7-1.9-1.4-2.8-2.2.7-.1 1.6-.5 2.5-1.5 1.6-1.7 2.4-2.1 3.1-2 .7 0 1.5.7 2.8 2.4s3.1 2.2 4.2 1.3c.1-.1.2-.1.3-.2.9-.7 1.2-1 2.9-4.2.4-.8 1.8-2.1 3.7-1.5.5 1.3.5 2.4 0 3.3z"
          fill="#0e0f23"
        />
        <g fill="#fff">
          <path
            clip-rule="evenodd"
            d="m22.9 14.6c-1.4 2-6.3 1-11-2.3-4.8-3.3-7.6-7.5-6.2-9.5s6.3-1 11 2.3 7.5 7.5 6.2 9.5zm-4.4-3c-.7 1-3.1.5-5.5-1.1-2.3-1.6-3.7-3.7-3-4.7s3.1-.5 5.5 1.1c2.3 1.6 3.7 3.7 3 4.7z"
            fill-rule="evenodd"
          />
          <path d="m4.6 4.6c0-.1-.1-.2-.2-.1s-.2.1-.2.2c.1.3.2.5.2.7 0 .1.1.2.2.1.1 0 .2-.1.1-.2 0-.2 0-.4-.1-.7z" />
          <path d="m5.1 6.2c0-.1-.1-.2-.2-.1s-.1.1-.1.2c1.1 2.5 3.4 5.2 6.4 7.2.1.1.2 0 .3 0 .1-.1 0-.2 0-.3-3.1-2-5.3-4.6-6.4-7z" />
          <path d="m17.2 16c-.1 0-.2 0-.2.1s0 .2.1.2c.3.1.7.2 1 .3.1 0 .2 0 .2-.1s0-.2-.1-.2c-.3-.1-.7-.2-1-.3z" />
          <path d="m19 16.4c-.1 0-.2.1-.2.2s.1.2.2.2c.8.1 1.7.2 2.4.1.1 0 .2-.1.2-.2s-.1-.2-.2-.2c-.8.1-1.6 0-2.4-.1z" />
        </g>
      </g>
    </svg>
  )
}
