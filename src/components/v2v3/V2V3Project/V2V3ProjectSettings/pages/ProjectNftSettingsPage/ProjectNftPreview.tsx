import { CSSProperties } from 'react'
import styles from './Capsules.module.css'

type ProjectNftPreviewProps = {
  previewTextColor: string
  previewBgColor: string
  previewAltBgColor: string
  handle?: string
  projectId: number | undefined
}

export const ProjectNftPreview = (props: ProjectNftPreviewProps) => {
  const textStyle: CSSProperties = {
    fill: '#' + props.previewTextColor,
    whiteSpace: 'pre',
    fontSize: '16px',
    fontWeight: 500,
    fontFamily: '"Capsules-500", monospace',
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="289"
      height="150"
      viewBox="0 0 289 150"
      className={styles as unknown as string}
    >
      <g clipPath="url(#clip0)">
        <path d="M289 0H0V150H289V0Z" fill="url(#paint0)" />
        <rect width="289" height="22" fill={'#' + props.previewTextColor} />
        <g id="head" filter="url(#filter2)">
          <text
            x="16"
            y="16"
            style={{ ...textStyle, fill: '#' + props.previewBgColor }}
          >
            {props.handle ? '@' + props.handle : 'Project ' + props.projectId}
          </text>
          <text
            x="259.25"
            y="16"
            style={{ ...textStyle, fill: '#' + props.previewBgColor }}
          >
            
          </text>
        </g>
        <g filter="url(#filter1)">
          <text x="0" y="48" style={textStyle}>
            {'  '}cʏcʟᴇ 10{'           '}7 ᴅᴀʏs
          </text>
          <text x="0" y="64" style={textStyle}></text>
          <text x="0" y="80" style={textStyle}>
            {'  '}ʙᴀʟᴀɴcᴇ{'               '}Ξ850
          </text>
          <text x="0" y="96" style={textStyle}>
            {'  '}ᴘᴀʏouᴛs{'            '}$150000
          </text>
          <text x="0" y="112" style={textStyle}>
            {'  '}ᴛoᴋᴇɴ suᴘᴘʟʏ{'    '}1234567890
          </text>
          <text x="0" y="128" style={textStyle}>
            {'  '}ᴘʀoᴊᴇcᴛ owɴᴇʀ{'  '}0x0000…0000
          </text>
        </g>
      </g>
      <defs>
        <filter
          id="filter1"
          x="-3.36"
          y="26.04"
          width="298"
          height="150"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feMorphology
            operator="dilate"
            radius="0.1"
            in="SourceAlpha"
            result="thicken"
          />
          <feGaussianBlur in="thicken" stdDeviation="0.5" result="blurred" />
          <feFlood
            floodColor={'#' + props.previewTextColor}
            result="glowColor"
          />
          <feComposite
            in="glowColor"
            in2="blurred"
            operator="in"
            result="softGlow_colored"
          />
          <feMerge>
            <feMergeNode in="softGlow_colored" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter
          id="filter2"
          x="0"
          y="0"
          width="298"
          height="150"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feMorphology
            operator="dilate"
            radius="0.05"
            in="SourceAlpha"
            result="thicken"
          />
          <feGaussianBlur in="thicken" stdDeviation="0.25" result="blurred" />
          <feFlood floodColor={'#' + props.previewBgColor} result="glowColor" />
          <feComposite
            in="glowColor"
            in2="blurred"
            operator="in"
            result="softGlow_colored"
          />
          <feMerge>
            <feMergeNode in="softGlow_colored" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <linearGradient
          id="paint0"
          x1="0"
          y1="202"
          x2="289"
          y2="202"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor={'#' + props.previewAltBgColor} />
          <stop offset="0.119792" stopColor={'#' + props.previewBgColor} />
          <stop offset="0.848958" stopColor={'#' + props.previewBgColor} />
          <stop offset="1" stopColor={'#' + props.previewAltBgColor} />
        </linearGradient>
        <clipPath id="clip0">
          <rect width="289" height="150" />
        </clipPath>
      </defs>
    </svg>
  )
}
