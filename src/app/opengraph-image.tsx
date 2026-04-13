import { ImageResponse } from 'next/og'

export const size        = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#634832',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '72px 80px',
          fontFamily: 'serif',
          position: 'relative',
        }}
      >
        {/* Top decorative rule */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ height: '1px', width: '48px', background: '#A28769' }} />
          <span style={{
            color: '#A28769',
            fontSize: '11px',
            letterSpacing: '0.5em',
            textTransform: 'uppercase',
            fontFamily: 'sans-serif',
            fontWeight: 400,
          }}>
            AI Wardrobe
          </span>
        </div>

        {/* Main wordmark */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div style={{
            color: '#E9DDC8',
            fontSize: '148px',
            fontWeight: 300,
            lineHeight: 0.9,
            letterSpacing: '-2px',
            fontFamily: 'serif',
          }}>
            FIT.
          </div>
          <div style={{
            color: '#CDB38F',
            fontSize: '28px',
            fontWeight: 300,
            letterSpacing: '0.05em',
            fontFamily: 'serif',
            fontStyle: 'italic',
          }}>
            Dress for every version of you.
          </div>
        </div>

        {/* Bottom row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {['Closet', 'Outfits', 'Calendar', 'AI Styling'].map((label) => (
              <span
                key={label}
                style={{
                  color: '#A28769',
                  fontSize: '10px',
                  letterSpacing: '0.4em',
                  textTransform: 'uppercase',
                  fontFamily: 'sans-serif',
                  padding: '6px 16px',
                  border: '1px solid #7a5940',
                  borderRadius: '999px',
                }}
              >
                {label}
              </span>
            ))}
          </div>
          <div style={{
            color: '#7a5940',
            fontSize: '11px',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            fontFamily: 'sans-serif',
          }}>
            Beta
          </div>
        </div>

        {/* Decorative corner accent */}
        <div style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '220px',
          height: '220px',
          border: '1px solid #7a5940',
          borderRadius: '0 0 0 220px',
          opacity: 0.4,
        }} />
      </div>
    ),
    { ...size }
  )
}
