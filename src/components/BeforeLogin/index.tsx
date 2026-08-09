import React from 'react'

const BeforeLogin: React.FC = () => {
  return (
    <div className="ujan-login-background" aria-hidden="true">
      {/* Blue ambient glow */}
      <div className="ujan-login-blue-glow" />

      {/* Cyan ambient glow */}
      <div className="ujan-login-cyan-glow" />

      {/* Bottom vector waves */}
      <div className="ujan-login-vectors">
        <svg viewBox="0 0 1440 300" preserveAspectRatio="none" className="h-full w-full">
          <path
            d="M0 235 C220 155 350 270 570 190 S910 105 1130 180 1330 205 1440 115"
            fill="none"
            stroke="#3b82f6"
            strokeOpacity="0.8"
            strokeWidth="1.4"
          />

          <path
            d="M0 275 C230 190 420 255 640 165 S990 145 1190 100 1360 145 1440 70"
            fill="none"
            stroke="#22d3ee"
            strokeOpacity="0.65"
            strokeWidth="1.2"
          />

          <path
            d="M0 205 C190 135 390 220 590 140 S960 205 1170 130 1330 95 1440 45"
            fill="none"
            stroke="#818cf8"
            strokeOpacity="0.5"
            strokeWidth="1"
          />

          <path
            d="M0 290 C280 220 480 290 720 205 S1080 180 1440 125"
            fill="none"
            stroke="#93c5fd"
            strokeOpacity="0.3"
            strokeWidth="0.8"
          />
        </svg>
      </div>
    </div>
  )
}

export default BeforeLogin
