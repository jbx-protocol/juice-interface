/* eslint-disable react/no-unknown-property */
export default function WebApp({ size }: { size?: number }) {
  const widthToHeight = 71 / 55
  const height = size ?? 55
  return (
    <svg
      style={{ height, width: widthToHeight * height }}
      width="71"
      height="55"
      viewBox="0 0 71 55"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="21" cy="21" r="20" fill="#EEEBE3" stroke="#E0DBD2" />
      <path
        d="M32 21C32 27.0751 27.0751 32 21 32M32 21C32 14.9249 27.0751 10 21 10M32 21H10M21 32C14.9249 32 10 27.0751 10 21M21 32C23.7514 28.9878 25.315 25.0788 25.4 21C25.315 16.9212 23.7514 13.0122 21 10M21 32C18.2486 28.9878 16.685 25.0788 16.6 21C16.685 16.9212 18.2486 13.0122 21 10M10 21C10 14.9249 14.9249 10 21 10"
        stroke="#AAA49A"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  )
}
