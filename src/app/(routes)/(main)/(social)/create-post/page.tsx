'use client'

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, ArrowRight, Upload } from 'lucide-react'
import { v4 as uuidv4 } from 'uuid'
import { supabase } from '@/src/app/supabaseConfig/client'
import { useUser } from '@/src/app/auth/auth'
import { useCloset } from '@/src/app/providers/closetContext'
import OutfitCard from '@/src/app/components/outfit-card'
import PostCollage from '@/src/app/components/social/post-collage'
import PageSkeleton from '@/src/app/components/page-skeleton'
import { VIBE_OPTIONS } from '@/src/app/types/clothing'
import type { Vibe } from '@/src/app/types/clothing'

type Source = 'outfit' | 'photos'

function TogglePill({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`px-3 py-1 rounded-full text-[9px] tracking-[0.25em] uppercase whitespace-nowrap transition-all duration-200 ${
        active ? 'bg-mocha-500 text-mocha-100' : 'border border-mocha-200 text-mocha-400 hover:border-mocha-400'
      }`}
    >
      {label}
    </button>
  )
}

export default function CreatePostPage() {
  const user = useUser()
  const router = useRouter()
  const { outfits, cards } = useCloset()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [step, setStep] = useState<1 | 2>(1)
  const [source, setSource] = useState<Source>('outfit')
  const [selectedOutfitId, setSelectedOutfitId] = useState<string | null>(null)
  const [photoFiles, setPhotoFiles] = useState<File[]>([])
  const [photoPreviewUrls, setPhotoPreviewUrls] = useState<string[]>([])
  const [caption, setCaption] = useState('')
  const [vibes, setVibes] = useState<Vibe[]>([])
  const [posting, setPosting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!user) return <PageSkeleton />

  const canProceed = source === 'outfit' ? !!selectedOutfitId : photoFiles.length > 0

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []).slice(0, 4)
    setPhotoFiles(files)
    setPhotoPreviewUrls(files.map(f => URL.createObjectURL(f)))
  }

  const previewImages: string[] = source === 'photos'
    ? photoPreviewUrls
    : (() => {
        const outfit = outfits.find(o => o.id === selectedOutfitId)
        if (!outfit) return []
        const clothingIds = [outfit.OuterWear, outfit.Top, outfit.Bottom, outfit.Shoes, ...outfit.Accessories].filter(Boolean) as string[]
        return clothingIds.slice(0, 4).map(cid => {
          const card = cards.find(c => c.id === cid)
          return card?.clothing.getImageUrl() ?? ''
        }).filter(Boolean)
      })()

  const handlePost = async () => {
    if (!user || !canProceed) return
    setPosting(true)
    setError(null)

    try {
      let imageUrls: string[] = []

      if (source === 'photos' && photoFiles.length > 0) {
        // Upload photos to post-images bucket
        const uploads = await Promise.all(photoFiles.map(async (file) => {
          const path = `${user.id}/${uuidv4()}.jpg`
          const { error: uploadErr } = await supabase.storage.from('post-images').upload(path, file)
          if (uploadErr) throw new Error(uploadErr.message)
          const { data: { publicUrl } } = supabase.storage.from('post-images').getPublicUrl(path)
          return publicUrl
        }))
        imageUrls = uploads
      } else if (source === 'outfit') {
        imageUrls = previewImages
      }

      const { error: insertErr } = await supabase.from('posts').insert({
        user_id: user.id,
        outfit_id: source === 'outfit' ? selectedOutfitId : null,
        caption: caption.trim() || null,
        image_urls: imageUrls,
        vibes,
      })

      if (insertErr) throw new Error(insertErr.message)
      router.push('/feed')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong')
      setPosting(false)
    }
  }

  return (
    <div className="min-h-screen bg-off-white-100 pt-16 pb-12">
      <div className="max-w-lg mx-auto px-4 pt-6">

        {/* Back */}
        <button
          onClick={() => step === 2 ? setStep(1) : router.back()}
          className="flex items-center gap-2 text-[10px] tracking-[0.35em] uppercase text-mocha-400 hover:text-mocha-500 transition-colors mb-6"
        >
          <ArrowLeft size={13} />
          {step === 2 ? 'Back' : 'Cancel'}
        </button>

        {/* Header */}
        <div className="mb-6">
          <p className="text-[10px] tracking-[0.5em] uppercase text-mocha-400 mb-1">
            Step {step} of 2
          </p>
          <h1 className="font-cormorant text-4xl font-light text-mocha-500">
            {step === 1 ? <>Share a <span className="italic text-mocha-400">look.</span></> : <>Caption it <span className="italic text-mocha-400">well.</span></>}
          </h1>
        </div>

        {step === 1 && (
          <>
            {/* Source toggle */}
            <div className="flex gap-2 mb-6">
              {(['outfit', 'photos'] as Source[]).map(s => (
                <button
                  key={s}
                  onClick={() => { setSource(s); setSelectedOutfitId(null); setPhotoFiles([]); setPhotoPreviewUrls([]) }}
                  className={`px-5 py-2 rounded-full text-[10px] tracking-[0.3em] uppercase transition-all duration-200 ${
                    source === s ? 'bg-mocha-500 text-mocha-100' : 'border border-mocha-200 text-mocha-400 hover:border-mocha-400'
                  }`}
                >
                  {s === 'outfit' ? 'From Outfit' : 'Upload Photos'}
                </button>
              ))}
            </div>

            {source === 'outfit' && (
              <div className="space-y-2">
                <p className="text-[9px] tracking-[0.4em] uppercase text-mocha-400 mb-3">Select an outfit</p>
                {outfits.length === 0 ? (
                  <p className="text-sm text-mocha-300 py-4">No outfits saved yet. Build one first.</p>
                ) : (
                  <div className="flex gap-4 overflow-x-auto pb-2">
                    {outfits.map(outfit => (
                      <div
                        key={outfit.id}
                        onClick={() => setSelectedOutfitId(outfit.id)}
                        className={`flex-shrink-0 cursor-pointer rounded-2xl transition-all duration-200 ${
                          selectedOutfitId === outfit.id ? 'ring-2 ring-mocha-500' : 'opacity-70 hover:opacity-100'
                        }`}
                      >
                        <OutfitCard
                          userID={user.id}
                          outfit={outfit}
                          clothes={cards}
                          canEdit={false}
                        />
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {source === 'photos' && (
              <div>
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  className="hidden"
                  onChange={handlePhotoChange}
                />
                {photoPreviewUrls.length === 0 ? (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-48 border-2 border-dashed border-mocha-200 rounded-2xl flex flex-col items-center justify-center gap-3 hover:border-mocha-400 transition-colors"
                  >
                    <Upload size={22} className="text-mocha-300" />
                    <p className="text-[10px] tracking-[0.35em] uppercase text-mocha-300">Upload up to 4 photos</p>
                  </button>
                ) : (
                  <div className="space-y-3">
                    <PostCollage images={photoPreviewUrls} />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-[9px] tracking-[0.3em] uppercase text-mocha-400 hover:text-mocha-500 transition-colors"
                    >
                      Change photos
                    </button>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setStep(2)}
              disabled={!canProceed}
              className="mt-8 w-full py-3.5 bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.35em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300 disabled:opacity-40 flex items-center justify-center gap-2"
            >
              Next <ArrowRight size={13} />
            </button>
          </>
        )}

        {step === 2 && (
          <>
            {/* Preview */}
            {previewImages.length > 0 && (
              <div className="mb-5">
                <PostCollage images={previewImages} />
              </div>
            )}

            {/* Caption */}
            <div className="space-y-1 mb-6">
              <label className="text-[9px] tracking-[0.4em] uppercase text-mocha-400">Caption</label>
              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                maxLength={280}
                rows={3}
                placeholder="Say something about this look…"
                className="w-full bg-transparent border-b border-mocha-200 focus:border-mocha-400 outline-none text-sm text-mocha-500 placeholder-mocha-200 resize-none py-2 transition-colors"
              />
              <p className="text-[9px] text-mocha-200 text-right">{caption.length}/280</p>
            </div>

            {/* Vibes */}
            <div className="space-y-2.5 mb-8">
              <p className="text-[9px] tracking-[0.4em] uppercase text-mocha-400">Vibe tags</p>
              <div className="flex flex-wrap gap-1.5">
                {VIBE_OPTIONS.map(v => (
                  <TogglePill
                    key={v}
                    label={v}
                    active={vibes.includes(v)}
                    onClick={() => setVibes(prev => prev.includes(v) ? prev.filter(x => x !== v) : [...prev, v])}
                  />
                ))}
              </div>
            </div>

            {error && <p className="text-[9px] text-red-400 mb-3">{error}</p>}

            <button
              onClick={handlePost}
              disabled={posting}
              className="w-full py-3.5 bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.35em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300 disabled:opacity-50"
            >
              {posting ? 'Posting…' : 'Share Look'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
