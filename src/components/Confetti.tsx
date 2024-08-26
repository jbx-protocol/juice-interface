import confettiData from 'data/lottie/confetti-animation-juicebox.json'
import Lottie from 'lottie-react'

export default function Confetti({ className }: { className?: string }) {
  return <Lottie className={className} animationData={confettiData} />
}
