interface Props {
  images: string[]
  alt?: string
  compact?: boolean
}

export default function PostCollage({ images, alt = 'post', compact = false }: Props) {
  const urls = images.slice(0, 4)
  const rounded = compact ? 'rounded-xl' : 'rounded-2xl'

  if (urls.length === 0) return null

  if (urls.length === 1) {
    return (
      <div className={`w-full overflow-hidden ${rounded} bg-mocha-100`}>
        <img src={urls[0]} alt={alt} className={`w-full object-cover ${compact ? 'h-48' : 'h-80'}`} />
      </div>
    )
  }

  if (urls.length === 2) {
    return (
      <div className={`grid grid-cols-2 gap-1 overflow-hidden ${rounded}`}>
        {urls.map((url, i) => (
          <img key={i} src={url} alt={`${alt} ${i + 1}`} className={`w-full object-cover bg-mocha-100 ${compact ? 'h-32' : 'h-56'}`} />
        ))}
      </div>
    )
  }

  if (urls.length === 3) {
    return (
      <div className={`grid grid-cols-2 gap-1 overflow-hidden ${rounded}`}>
        <img src={urls[0]} alt={`${alt} 1`} className={`w-full object-cover bg-mocha-100 row-span-2 ${compact ? 'h-32' : 'h-56'}`} style={{ gridRow: 'span 2' }} />
        <img src={urls[1]} alt={`${alt} 2`} className={`w-full object-cover bg-mocha-100 ${compact ? 'h-16' : 'h-[108px]'}`} />
        <img src={urls[2]} alt={`${alt} 3`} className={`w-full object-cover bg-mocha-100 ${compact ? 'h-16' : 'h-[108px]'}`} />
      </div>
    )
  }

  // 4 images — 2x2 grid
  return (
    <div className={`grid grid-cols-2 gap-1 overflow-hidden ${rounded}`}>
      {urls.map((url, i) => (
        <img key={i} src={url} alt={`${alt} ${i + 1}`} className={`w-full object-cover bg-mocha-100 ${compact ? 'h-24' : 'h-40'}`} />
      ))}
    </div>
  )
}
