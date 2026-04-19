'use client'

import { useState, useEffect } from 'react';
import { useUser } from '@/src/app/auth/auth';
import { supabase } from '@/src/app/supabaseConfig/client';
import { generateOutfit } from '@/src/lib/generate-outfit';
import type { ClothingCard } from '@/src/lib/generate-outfit';
import {
  VIBE_OPTIONS, STYLE_OPTIONS, WEATHER_OPTIONS,
} from '@/src/app/types/clothing';
import type { Vibe, Style, Weather } from '@/src/app/types/clothing';
import type { GeneratedOutfit, OutfitPreferences, OutfitDoc } from '@/src/app/types/outfit';

interface Props {
  userId: string;
  cards: ClothingCard[];
  onClose: () => void;
  onSave: (doc: OutfitDoc) => void;
}

function ScoreDots({ value }: { value: number }) {
  const filled = Math.round(value / 20); // 0–100 → 0–5 dots
  return (
    <span className="flex gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <span
          key={i}
          className={`w-1.5 h-1.5 rounded-full ${i < filled ? 'bg-mocha-500' : 'bg-mocha-200'}`}
        />
      ))}
    </span>
  );
}

function TogglePill<T extends string>({
  label, active, onClick,
}: { label: T; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-[9px] tracking-[0.25em] uppercase whitespace-nowrap transition-all duration-200 ${
        active
          ? 'bg-mocha-500 text-mocha-100'
          : 'border border-mocha-200 text-mocha-400 hover:border-mocha-400 hover:text-mocha-500'
      }`}
    >
      {label}
    </button>
  );
}

function SlotBox({ label, item }: { label: string; item?: { name: string; imageUrl: string } | null }) {
  return (
    <div className="border border-dashed border-mocha-300 rounded-2xl aspect-square flex flex-col justify-center items-center overflow-hidden">
      {item ? (
        <img alt={item.name} src={item.imageUrl} className="w-full h-full object-contain p-2" />
      ) : (
        <p className="text-[9px] tracking-[0.3em] uppercase text-mocha-300">{label}</p>
      )}
    </div>
  );
}

export default function OutfitGeneratorModal({ userId, cards, onClose, onSave }: Props) {
  const user = useUser();
  const [vibes,   setVibes]   = useState<Vibe[]>([]);
  const [styles,  setStyles]  = useState<Style[]>([]);
  const [weather, setWeather] = useState<Weather[]>([]);

  // Seed from preferences saved in Account settings
  useEffect(() => {
    if (user) {
      const prefs = user.user_metadata?.preferences ?? {};
      if (prefs.vibes?.length)   setVibes(prefs.vibes);
      if (prefs.styles?.length)  setStyles(prefs.styles);
      if (prefs.weather?.length) setWeather(prefs.weather);
    }
  }, [user]);
  const [result, setResult] = useState<GeneratedOutfit | { error: string } | null>(null);
  const [saving,  setSaving]  = useState(false);

  function toggle<T>(arr: T[], val: T, set: (a: T[]) => void) {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val]);
  }

  const generated = result && !('error' in result) ? result as GeneratedOutfit : null;
  const errorMsg  = result && 'error' in result ? (result as { error: string }).error : null;

  const handleGenerate = () => {
    setResult(null);
    const prefs: OutfitPreferences = { vibes, styles, weather };
    const res = generateOutfit(cards, prefs);
    setResult(res);
  };

  const handleSave = async () => {
    if (!generated) return;
    setSaving(true);
    const { data, error } = await supabase.from('outfits').insert({
      user_id:    userId,
      outer_wear: generated.outerwear?.id ?? null,
      top:        generated.top.id,
      bottom:     generated.bottom.id,
      shoes:      generated.shoes?.id ?? null,
      accessories: generated.accessories.map(a => a.id),
      dates:      [],
    }).select().single();

    if (error) {
      console.error('Failed to save outfit:', error.message);
      setSaving(false);
      return;
    }

    if (data) {
      onSave({
        id:          data.id,
        OuterWear:   data.outer_wear ?? null,
        Top:         data.top ?? '',
        Bottom:      data.bottom ?? '',
        Shoes:       data.shoes ?? null,
        Accessories: data.accessories ?? [],
        Dates:       data.dates ?? [],
      });
    }
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-lg bg-off-white-100 rounded-3xl p-8 shadow-2xl my-4">

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full border border-mocha-200 text-mocha-400 hover:border-mocha-400 hover:text-mocha-500 transition-all duration-200"
          aria-label="Close"
        >
          <span className="text-xs leading-none">✕</span>
        </button>

        {/* Header */}
        <p className="text-[10px] tracking-[0.5em] uppercase text-mocha-400 mb-2">AI Generate</p>
        <h2 className="font-cormorant text-4xl font-light text-mocha-500 leading-tight mb-6">
          Build a<br />
          <span className="italic text-mocha-400">look for me.</span>
        </h2>

        {/* Preferences */}
        <div className="space-y-4 mb-6">
          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-mocha-400 mb-2">Vibe</p>
            <div className="flex flex-wrap gap-1.5">
              {VIBE_OPTIONS.map(v => (
                <TogglePill key={v} label={v} active={vibes.includes(v)} onClick={() => toggle(vibes, v, setVibes)} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-mocha-400 mb-2">Style</p>
            <div className="flex flex-wrap gap-1.5">
              {STYLE_OPTIONS.map(s => (
                <TogglePill key={s} label={s} active={styles.includes(s)} onClick={() => toggle(styles, s, setStyles)} />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[9px] tracking-[0.4em] uppercase text-mocha-400 mb-2">Weather</p>
            <div className="flex flex-wrap gap-1.5">
              {WEATHER_OPTIONS.map(w => (
                <TogglePill key={w} label={w} active={weather.includes(w)} onClick={() => toggle(weather, w, setWeather)} />
              ))}
            </div>
          </div>
        </div>

        <button
          onClick={handleGenerate}
          className="w-full py-3 bg-mocha-500 text-mocha-100 text-[11px] tracking-[0.3em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300"
        >
          Generate Look
        </button>

        {/* Error state */}
        {errorMsg && (
          <p className="mt-5 text-center text-[10px] tracking-[0.3em] uppercase text-mocha-400">
            {errorMsg}
          </p>
        )}

        {/* Result */}
        {generated && (
          <>
            <div className="my-6 h-px bg-mocha-200" />

            {/* Preview grid */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <SlotBox label="Outerwear" item={generated.outerwear} />
              <SlotBox label="Top"       item={generated.top} />
              <SlotBox label="Bottom"    item={generated.bottom} />
            </div>

            {(generated.shoes || generated.accessories.length > 0) && (
              <div className="grid grid-cols-3 gap-3 mb-5">
                <SlotBox label="Shoes"     item={generated.shoes} />
                {generated.accessories[0] && (
                  <SlotBox label="Accessory" item={generated.accessories[0]} />
                )}
              </div>
            )}

            {/* Scores */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-[9px] tracking-[0.35em] uppercase text-mocha-400">Warmth</span>
                <ScoreDots value={generated.warmthScore} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] tracking-[0.35em] uppercase text-mocha-400">Comfort</span>
                <ScoreDots value={generated.comfortScore} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[9px] tracking-[0.35em] uppercase text-mocha-400">Confidence</span>
                <ScoreDots value={generated.confidenceScore} />
              </div>
            </div>

            {/* Tags */}
            {generated.dominantVibes.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-2">
                {generated.dominantVibes.map(v => (
                  <span key={v} className="px-2 py-0.5 bg-mocha-100 text-mocha-500 rounded-full text-[9px] tracking-[0.2em] uppercase">{v}</span>
                ))}
              </div>
            )}
            {generated.weatherSuitability.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mb-5">
                {generated.weatherSuitability.map(w => (
                  <span key={w} className="px-2 py-0.5 border border-mocha-200 text-mocha-400 rounded-full text-[9px] tracking-[0.2em] uppercase">{w}</span>
                ))}
              </div>
            )}

            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full py-3 bg-mocha-500 text-mocha-100 text-[11px] tracking-[0.3em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300 disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save Look'}
            </button>
          </>
        )}
      </div>
    </div>
  );
}
