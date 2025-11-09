import { ImageResponse } from 'next/og';

// Image metadata
export const alt = 'Suitify - AI-Verified Dataset Marketplace on Sui';
export const size = {
  width: 1200,
  height: 675,
};

export const contentType = 'image/png';

// Image generation (same as OG image but different dimensions)
export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1C1C1E 0%, #2C2C2E 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {/* Background Pattern */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 30%, rgba(255, 44, 178, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(196, 0, 255, 0.1) 0%, transparent 50%)',
          }}
        />

        {/* Content Container */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '60px',
            zIndex: 10,
          }}
        >
          {/* Logo/Icon */}
          <div
            style={{
              width: '100px',
              height: '100px',
              background: 'linear-gradient(135deg, #FF2CB2 0%, #C400FF 100%)',
              borderRadius: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '32px',
              boxShadow: '0 20px 60px rgba(255, 44, 178, 0.4)',
            }}
          >
            <svg
              width="60"
              height="60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <ellipse cx="12" cy="5" rx="9" ry="3" />
              <path d="M3 5V19A9 3 0 0 0 21 19V5" />
              <path d="M3 12A9 3 0 0 0 21 12" />
            </svg>
          </div>

          {/* Title */}
          <h1
            style={{
              fontSize: '64px',
              fontWeight: 'bold',
              color: 'white',
              margin: '0 0 20px 0',
              textAlign: 'center',
              letterSpacing: '-0.02em',
            }}
          >
            Suitify
          </h1>

          {/* Tagline */}
          <p
            style={{
              fontSize: '32px',
              color: '#FF2CB2',
              margin: '0 0 28px 0',
              textAlign: 'center',
              fontWeight: '600',
            }}
          >
            Certify Your Data on Sui
          </p>

          {/* Description */}
          <p
            style={{
              fontSize: '22px',
              color: '#ABABAF',
              margin: '0',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: '1.5',
            }}
          >
            AI-verified, blockchain-certified dataset marketplace
          </p>

          {/* Features */}
          <div
            style={{
              display: 'flex',
              gap: '36px',
              marginTop: '40px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  background: '#00D9B3',
                  borderRadius: '50%',
                }}
              />
              <span style={{ color: 'white', fontSize: '18px' }}>AI Verified</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  background: '#FF2CB2',
                  borderRadius: '50%',
                }}
              />
              <span style={{ color: 'white', fontSize: '18px' }}>Blockchain Certified</span>
            </div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}
            >
              <div
                style={{
                  width: '20px',
                  height: '20px',
                  background: '#C400FF',
                  borderRadius: '50%',
                }}
              />
              <span style={{ color: 'white', fontSize: '18px' }}>Walrus Storage</span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '0',
            left: '0',
            right: '0',
            height: '8px',
            background: 'linear-gradient(90deg, #FF2CB2 0%, #C400FF 50%, #00D9B3 100%)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
