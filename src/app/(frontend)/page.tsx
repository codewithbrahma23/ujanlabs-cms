import Link from 'next/link'
import { ThemeSelector } from '@/providers/Theme/ThemeSelector'

export default function CMSLandingPage() {
  return (
    <main className="relative flex min-h-screen overflow-hidden bg-background text-foreground">
      {/* Subtle mesh background */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-60
          [background-image:
            radial-gradient(circle_at_20%_20%,rgba(37,99,235,0.12),transparent_28%),
            radial-gradient(circle_at_80%_30%,rgba(6,182,212,0.10),transparent_30%),
            radial-gradient(circle_at_50%_80%,rgba(99,102,241,0.08),transparent_32%)
          ]
        "
      />

      {/* Fine technical grid */}
      <div
        className="
          pointer-events-none
          absolute
          inset-0
          opacity-[0.18]
          [background-size:48px_48px]
          [background-image:
            linear-gradient(to_right,rgba(100,116,139,0.18)_1px,transparent_1px),
            linear-gradient(to_bottom,rgba(100,116,139,0.18)_1px,transparent_1px)
          ]
          dark:opacity-[0.10]
        "
      />

      {/* Theme selector */}
      <div className="absolute right-6 top-6 z-20">
        <ThemeSelector />
      </div>

      {/* Main content */}
      <div className="relative z-10 mx-auto flex w-full max-w-6xl items-center px-6 py-24 md:px-10">
        <div className="max-w-2xl">
          <div
            className="
              mb-6
              inline-flex
              items-center
              rounded-full
              border
              border-slate-900/10
              bg-white/60
              px-4
              py-2
              text-xs
              font-medium
              tracking-[0.18em]
              text-slate-600
              backdrop-blur-xl
              dark:border-white/10
              dark:bg-white/[0.04]
              dark:text-slate-300
            "
          >
            UJAN LABS
          </div>

          <h1
            className="
              max-w-xl
              text-4xl
              font-semibold
              tracking-tight
              text-slate-950
              sm:text-5xl
              md:text-6xl
              dark:text-white
            "
          >
            Content Management System
          </h1>

          <p
            className="
              mt-6
              max-w-xl
              text-base
              leading-7
              text-slate-600
              sm:text-lg
              dark:text-slate-400
            "
          >
            Manage website content, media, pages and digital experiences for Ujan Labs.
          </p>

          <div className="mt-10">
            <Link
              href="/admin"
              className="
                inline-flex
                items-center
                justify-center
                rounded-xl
                bg-slate-950
                px-6
                py-3
                text-sm
                font-medium
                text-white
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-lg
                dark:bg-white
                dark:text-slate-950
              "
            >
              Visit Admin Dashboard
              <span className="ml-2">→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom vector lines */}
      {/* Bottom vector lines */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[300px] overflow-hidden">
        {/* Blue glow behind the vector lines - mainly visible in dark mode */}
        <div
          className="
      absolute
      bottom-[-100px]
      left-1/2
      h-[260px]
      w-[80%]
      -translate-x-1/2
      rounded-full
      bg-blue-500/0
      blur-[100px]

      dark:bg-blue-500/20
    "
        />

        {/* Secondary cyan glow */}
        <div
          className="
      absolute
      bottom-[-120px]
      left-[65%]
      h-[220px]
      w-[45%]
      -translate-x-1/2
      rounded-full
      bg-cyan-400/0
      blur-[110px]

      dark:bg-cyan-400/15
    "
        />

        <svg
          viewBox="0 0 1440 300"
          preserveAspectRatio="none"
          className="relative h-full w-full"
          aria-hidden="true"
        >
          {/* Main blue vector */}
          <path
            d="M0 235 C220 155 350 270 570 190 S910 105 1130 180 1330 205 1440 115"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.4"
            className="
        text-blue-500/25
        dark:text-blue-400/80
        dark:[filter:drop-shadow(0_0_6px_rgba(96,165,250,0.8))]
      "
          />

          {/* Cyan vector */}
          <path
            d="M0 275 C230 190 420 255 640 165 S990 145 1190 100 1360 145 1440 70"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            className="
        text-cyan-500/20
        dark:text-cyan-400/65
        dark:[filter:drop-shadow(0_0_7px_rgba(34,211,238,0.7))]
      "
          />

          {/* Indigo vector */}
          <path
            d="M0 205 C190 135 390 220 590 140 S960 205 1170 130 1330 95 1440 45"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="
        text-indigo-500/15
        dark:text-indigo-400/50
        dark:[filter:drop-shadow(0_0_5px_rgba(129,140,248,0.6))]
      "
          />

          {/* Additional subtle technical line */}
          <path
            d="M0 290 C280 220 480 290 720 205 S1080 180 1440 125"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.8"
            className="
        text-slate-400/15
        dark:text-blue-300/30
      "
          />
        </svg>
      </div>
    </main>
  )
}
