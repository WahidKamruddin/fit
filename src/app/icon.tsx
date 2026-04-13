import { ImageResponse } from 'next/og'

export const size        = { width: 32, height: 32 }
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#634832',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '7px',
        }}
      >
        <span
          style={{
            color: '#E9DDC8',
            fontSize: '19px',
            fontFamily: 'serif',
            fontWeight: 400,
            letterSpacing: '-0.5px',
            marginTop: '1px',
          }}
        >
          F
        </span>
      </div>
    ),
    { ...size }
  )
}
