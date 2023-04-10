import { ThemeConfig } from 'tailwindcss/types/config.js'
import * as a from '../../../../tailwind.config.js'

export default function Colors() {
  if (!a.theme) return null
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const swatch = themeToSwatch(a.theme as any)

  return (
    <div className="grid grid-cols-12 gap-y-16 px-16 py-16">
      {swatch.map(gradient => (
        <ColorGradient key={gradient.name} gradient={gradient} />
      ))}
    </div>
  )
}

const ColorGradient = ({ gradient }: { gradient: Gradient }) => {
  if (gradient.colors.length === 0) return null
  return (
    <>
      <div className="col-span-1 flex">
        <h2 className="text-base text-2xl">{gradient.name}</h2>
      </div>
      <div className="col-span-11 flex flex-row gap-6">
        {gradient.colors.map(({ name, color }) => (
          <ColorSquare key={name} name={name} color={color} />
        ))}
      </div>
    </>
  )
}

const ColorSquare = ({ name, color }: Color) => {
  return (
    <div className="h-32 w-32 flex-shrink-0 overflow-hidden rounded-xl shadow-xl">
      <div className="h-1/2 w-full" style={{ backgroundColor: color }}></div>
      <div className="m-2 h-1/2 w-full">
        <div className="font-medium">{name}</div>
        <div className="text-[#525252]">{color}</div>
      </div>
    </div>
  )
}

function themeToSwatch(theme: ThemeConfig): Swatch {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const colors = theme?.colors as Record<string, any>
  const swatch: Swatch = Object.entries(colors)
    .map(([color, keys]) => {
      if (color === 'extend') return null
      return {
        name: color,
        colors: Object.entries(keys).map(([key, value]) => ({
          name: key,
          color: value,
        })),
      }
    })
    .filter(Boolean) as Swatch
  return swatch
}

type Swatch = Gradient[]
type Gradient = { name: string; colors: Color[] }
type Color = { name: string; color: string }
