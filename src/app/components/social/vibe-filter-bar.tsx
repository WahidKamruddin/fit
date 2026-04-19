'use client'

import { VIBE_OPTIONS } from '@/src/app/types/clothing'
import type { Vibe } from '@/src/app/types/clothing'

interface Props {
  selected: Vibe | null
  onChange: (vibe: Vibe | null) => void
}

export default function VibeFilterBar({ selected, onChange }: Props) {
  return (
    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
      <button
        onClick={() => onChange(null)}
        className={`flex-shrink-0 px-3 py-1 rounded-full text-[9px] tracking-[0.25em] uppercase whitespace-nowrap transition-all duration-200 ${
          selected === null
            ? 'bg-mocha-500 text-mocha-100'
            : 'border border-mocha-200 text-mocha-400 hover:border-mocha-400'
        }`}
      >
        All
      </button>
      {VIBE_OPTIONS.map(v => (
        <button
          key={v}
          onClick={() => onChange(selected === v ? null : v)}
          className={`flex-shrink-0 px-3 py-1 rounded-full text-[9px] tracking-[0.25em] uppercase whitespace-nowrap transition-all duration-200 ${
            selected === v
              ? 'bg-mocha-500 text-mocha-100'
              : 'border border-mocha-200 text-mocha-400 hover:border-mocha-400'
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  )
}
