import Image from 'next/image'
import Link from 'next/link'

type LogoProps = {
  href?: string
  iconOnly?: boolean
  className?: string
  height?: number
}

export default function Logo({ 
  href = '/', 
  iconOnly = false, 
  className = '',
  height = 40 
}: LogoProps) {
  const content = iconOnly ? (
    <div 
      className={`relative transition-all duration-300 ease-in-out hover:scale-110 ${className}`} 
      style={{ width: height, height: height }}
    >
      <Image
        src="/logo-icon.png"
        alt="Poplygo"
        width={height}
        height={height}
        className="object-contain"
        priority
      />
    </div>
  ) : (
    <div 
      className={`relative transition-all duration-300 ease-in-out hover:scale-105 hover:brightness-110 ${className}`} 
      style={{ height: height, width: 'auto' }}
    >
      <Image
        src="/logo.png"
        alt="Poplygo"
        width={200}
        height={40}
        className="object-contain"
        style={{ height: height, width: 'auto' }}
        priority
      />
    </div>
  )

  if (href) {
    return (
      <Link href={href} className="cursor-pointer block group">
        {content}
      </Link>
    )
  }

  return content
}
