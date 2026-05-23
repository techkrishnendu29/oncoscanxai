'use client'

import Image from 'next/image'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  showText?: boolean
}

export function Logo({
  className,
  size = 'md',
  showText = true,
}: LogoProps) {
  const sizes = {
    sm: {
      icon: 32,
      text: 'text-lg',
      subtext: 'text-[9px]',
    },
    md: {
      icon: 44,
      text: 'text-2xl',
      subtext: 'text-[11px]',
    },
    lg: {
      icon: 64,
      text: 'text-4xl',
      subtext: 'text-xs',
    },
  }

  const { icon, text, subtext } = sizes[size]

  return (
    <div className={cn('flex items-center gap-3 select-none', className)}>
      {/* Logo Icon */}
      <div className="relative flex-shrink-0">
        <Image
          src="/oncoscan-logo-mark.png"
          alt="OncoScan XAI Logo Mark"
          width={icon}
          height={icon}
          className="object-contain drop-shadow-md"
          priority
        />

        {/* Optional pulse animation */}
        <div
          className="absolute inset-0 rounded-full border border-cyan-500/20 animate-ping pointer-events-none"
          style={{ animationDuration: '3s' }}
        />
      </div>

      {/* Text Section */}
      {showText && (
        <div className="flex flex-col justify-center">
          {/* Main Brand Name */}
          <div className="flex items-baseline font-sans font-semibold tracking-tight leading-none text-slate-900 dark:text-white">
            <span className={cn(text)}>OncoScan</span>

            <div className="relative inline-block ml-0.5">
              {/* Decorative arc above XAI */}
              <svg
                className="absolute -top-[5px] left-0 w-full overflow-visible"
                height="8"
                viewBox="0 0 42 8"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M1 6 C 10 -2, 20 7, 21 6 C 22 5, 31 -2, 41 6"
                  stroke="#115e59"
                  strokeWidth="2"
                  strokeLinecap="round"
                  fill="none"
                />
                <path
                  d="M1 6 C 10 -2, 20 7, 21 6 C 22 5, 31 -2, 41 6"
                  stroke="#0284c7"
                  strokeWidth="1"
                  strokeLinecap="round"
                  fill="none"
                />
              </svg>

              <span
                className={cn(
                  'text-cyan-600 dark:text-cyan-400 font-bold',
                  text
                )}
              >
                XAI
              </span>
            </div>
          </div>

          {/* Tagline */}
          <span
            className={cn(
              'text-slate-500 dark:text-slate-400 font-medium tracking-normal mt-1',
              subtext
            )}
          >
            Dual-Image Breast Health Intelligence
          </span>
        </div>
      )}
    </div>
  )
}