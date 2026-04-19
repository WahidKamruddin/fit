'use client'

import Clothing from "@/src/app/classes/clothes";
import { useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { supabase } from "@/src/app/supabaseConfig/client";
import CardList from "@/src/app/components/card-list";
import { FileUploader } from "react-drag-drop-files";
import { useUser } from "@/src/app/auth/auth";
import { v4 } from "uuid";
import { useCloset } from "@/src/app/providers/closetContext";
import { Pencil, Search } from "lucide-react";
import PageSkeleton from "@/src/app/components/page-skeleton";
import { analyzeClothing } from "@/src/lib/actions/analyze-clothing";
import { logUploadError } from "@/src/lib/actions/log-error";
import type { ClothingAnalysis } from "@/src/app/types/clothing";
import { capitalize } from "@/src/app/lib/utils";


export default function Closet() {
  const user = useUser();

  // Header states
  const [all, setAll] = useState(true);
  const [outerWear, setOuterWear] = useState(false);
  const [tops, setTops] = useState(false);
  const [bottoms, setBottoms] = useState(false);
  const [shoes, setShoes] = useState(false);
  const [accessories, setAccessories] = useState(false);
  const [starred, setStarred] = useState(false);

  // Fetch data states
  const { cards, hasClothes, addCard } = useCloset();

  // Add data states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  const [pickerError, setPickerError] = useState('');


  const fileTypes = ["JPG", "JPEG", "PNG", "GIF", "WEBP", "HEIC", "HEIF"];

  // Function to handle background removal (client-side via @imgly/background-removal)
  const handleBackgroundRemoval = async (): Promise<File> => {
    if (!file) throw new Error('No file selected');

    const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/heic', 'image/heif'];
    if (!ALLOWED_TYPES.includes(file.type)) {
      throw new Error('Please upload a valid image file (JPG, PNG, GIF, WEBP, HEIC, or HEIF).');
    }

    const MAX_SIZE_MB = 50;
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      throw new Error(`Image must be under ${MAX_SIZE_MB}MB.`);
    }

    // Convert HEIC/HEIF to JPEG before anything else (browsers can't decode them natively)
    let sourceFile: File = file;
    if (file.type === 'image/heic' || file.type === 'image/heif') {
      setLoadingStep('Converting image…');
      const heic2any = (await import('heic2any')).default;
      const converted = await heic2any({ blob: file, toType: 'image/jpeg', quality: 0.92 });
      const blob = Array.isArray(converted) ? converted[0] : converted;
      sourceFile = new File([blob], 'converted.jpg', { type: 'image/jpeg' });
    }

    // Pre-compress to max 1500px before background removal.
    // The ONNX model (isnet_quint8) works at ~1024px internally — feeding it a
    // larger image wastes memory and time with no quality benefit.
    sourceFile = await new Promise<File>((resolve) => {
      const img = new Image();
      img.onload = () => {
        const MAX = 1500;
        const scale = Math.min(1, MAX / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob(
          (blob) => resolve(new File([blob!], 'pre-compressed.jpg', { type: 'image/jpeg' })),
          'image/jpeg',
          0.90,
        );
      };
      img.src = URL.createObjectURL(sourceFile);
    });

    const { removeBackground } = await import('@imgly/background-removal');

    try {
      const imageBlob = await removeBackground(sourceFile, {
        model: 'isnet_quint8',
        output: {
          format: 'image/png',
          quality: 1.0,
        },
        progress: () => {
          setLoadingStep('Removing background…');
        },
      });
      return new File([imageBlob], 'processed-image.png', { type: 'image/png' });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      logUploadError({
        step: 'bg_removal',
        error: message,
        fileSize: file.size,
        fileType: file.type,
        userId: user?.id,
      }).catch(() => {});
      throw new Error('Background removal failed. Please try a different image.');
    }
  };

  const createClothing = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdd(false);
    setLoading(true);

    try {
      setLoadingStep('Removing background…');
      const processedFile = await handleBackgroundRemoval();
      if (user) await addItem(processedFile);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.';
      setLoadingStep(message);
      // Fire-and-forget — doesn't block the error UI.
      // bg_removal, upload, and db_insert steps log themselves with their own context.
      // This catches anything that slipped through (e.g. server action serialization errors).
      logUploadError({
        step: 'unknown',
        error: message,
        fileSize: file?.size,
        fileType: file?.type,
        userId: user?.id,
      }).catch(() => {});
      await new Promise(res => setTimeout(res, 3000));
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const addItem = async (processedFile: File) => {
    const imageID = v4();
    const path = `${user!.id}/${imageID}`;

    // Produce two outputs from the background-removed PNG in one canvas pass:
    //   • fileToUpload — WebP @ 0.88, capped at 1800px (stored in Supabase, ~25-35% smaller than PNG)
    //   • base64       — JPEG @ 0.85, capped at 1024px (sent to Gemini; stays under Netlify's 6MB limit)
    const { fileToUpload, base64 } = await new Promise<{ fileToUpload: File; base64: string }>((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Storage image: cap at 1800px, WebP supports transparency from BG removal
        const STORE_MAX = 1800;
        const storeScale = Math.min(1, STORE_MAX / Math.max(img.width, img.height));
        const storeCanvas = document.createElement('canvas');
        storeCanvas.width = Math.round(img.width * storeScale);
        storeCanvas.height = Math.round(img.height * storeScale);
        storeCanvas.getContext('2d')!.drawImage(img, 0, 0, storeCanvas.width, storeCanvas.height);

        // AI image: further downscale to 1024px JPEG
        const AI_MAX = 1024;
        const aiScale = Math.min(1, AI_MAX / Math.max(storeCanvas.width, storeCanvas.height));
        const aiCanvas = document.createElement('canvas');
        aiCanvas.width = Math.round(storeCanvas.width * aiScale);
        aiCanvas.height = Math.round(storeCanvas.height * aiScale);
        aiCanvas.getContext('2d')!.drawImage(storeCanvas, 0, 0, aiCanvas.width, aiCanvas.height);
        const base64 = aiCanvas.toDataURL('image/jpeg', 0.85).split(',')[1];

        storeCanvas.toBlob(
          (blob) => resolve({ fileToUpload: new File([blob!], 'processed-image.webp', { type: 'image/webp' }), base64 }),
          'image/webp',
          0.88,
        );
      };
      img.src = URL.createObjectURL(processedFile);
    });

    // Upload to storage and AI scan in parallel
    setLoadingStep('Uploading & analyzing…');
    const [uploadResult, analysis] = await Promise.all([
      supabase.storage.from('clothing-images').upload(path, fileToUpload),
      analyzeClothing(base64, 'image/jpeg'),
    ]);

    if (uploadResult.error) {
      logUploadError({
        step: 'upload',
        error: uploadResult.error.message,
        fileSize: fileToUpload.size,
        fileType: fileToUpload.type,
        userId: user!.id,
      }).catch(() => {});
      throw new Error('Upload failed. Please try again.');
    }

    const { data: { publicUrl } } = supabase.storage.from('clothing-images').getPublicUrl(path);
    await addClothing(publicUrl, imageID, analysis);
  };

  const addClothing = async (imgUrl: string, imageID: string, analysis: ClothingAnalysis) => {
    const { data, error } = await supabase.from('clothes').insert({
      user_id: user!.id,
      name: analysis.name,
      color: analysis.color,
      type: analysis.type,
      image: imgUrl,
      image_id: imageID,
      material: analysis.metadata.material,
      style: analysis.metadata.style,
      comfort: analysis.metadata.comfort,
      warmth: analysis.metadata.warmth,
      weather: analysis.metadata.weather,
      vibe: analysis.metadata.vibe,
      size: analysis.metadata.size,
    }).select().single();

    if (error) {
      logUploadError({
        step: 'db_insert',
        error: error.message,
        userId: user!.id,
      }).catch(() => {});
      throw new Error('Could not save your item. Please try again.');
    }

    if (data) {
      const clothing = new Clothing(
        data.name, data.color, data.type, data.image,
        data.material, data.style,
        data.comfort, data.warmth, data.weather, data.vibe, data.size,
      );
      clothing.starred = data.starred;
      addCard({ clothing, id: data.id, imageId: data.image_id });
    }
  };

  const clearFilters = () => { setAll(false); setOuterWear(false); setTops(false); setBottoms(false); setShoes(false); setAccessories(false); };
  const filterAll = () => { clearFilters(); setAll(true); };
  const filterOuterWear = () => { clearFilters(); setOuterWear(true); };
  const filterTops = () => { clearFilters(); setTops(true); };
  const filterBottoms = () => { clearFilters(); setBottoms(true); };
  const filterShoes = () => { clearFilters(); setShoes(true); };
  const filterAccessories = () => { clearFilters(); setAccessories(true); };
  const toggleStarred = () => setStarred(s => !s);

  if (!user) return <PageSkeleton />;

  const firstName = capitalize((user.user_metadata?.full_name ?? user.user_metadata?.name)?.split(' ')[0] ?? 'Your');

  const filters = [
    { label: 'All',         active: all,          onClick: filterAll         },
    { label: 'Outerwear',   active: outerWear,    onClick: filterOuterWear   },
    { label: 'Tops',        active: tops,          onClick: filterTops        },
    { label: 'Bottoms',     active: bottoms,       onClick: filterBottoms     },
    { label: 'Shoes',       active: shoes,         onClick: filterShoes       },
    { label: 'Accessories', active: accessories,   onClick: filterAccessories },
  ];

  const categoryCards = all          ? cards
    : outerWear   ? cards.filter(c => c.clothing.getType() === 'Outerwear')
    : tops        ? cards.filter(c => c.clothing.getType() === 'Top')
    : bottoms     ? cards.filter(c => c.clothing.getType() === 'Bottom')
    : shoes       ? cards.filter(c => c.clothing.getType() === 'Shoes')
    : accessories ? cards.filter(c => c.clothing.getType() === 'Accessory')
    : cards;
  const activeCards = starred ? categoryCards.filter(c => c.clothing.getStarred()) : categoryCards;

  const trimmed = searchQuery.trim().toLowerCase();
  const displayedCards = trimmed
    ? activeCards.filter(c => c.clothing.getName().toLowerCase().includes(trimmed))
    : activeCards;

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-off-white-100">

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="flex-shrink-0 pt-16 px-4 sm:px-8 lg:px-20">

        {/* Overline */}
        <div className="pt-8 flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.05s' }}>
          <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">Wardrobe</span>
          <div className="w-8 h-px bg-mocha-300" />
          <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">{cards.length} {cards.length === 1 ? 'item' : 'items'}</span>
        </div>

        {/* Title + actions row */}
        <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
          <h1
            className="font-cormorant font-light text-mocha-500 leading-[0.95] animate-fade-in-up"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', animationDelay: '0.15s' }}
          >
            {firstName}{"'s"}<br />
            <span className="italic text-mocha-400">Closet.</span>
          </h1>

          {/* Action buttons */}
          <div className="flex items-center gap-2 sm:gap-3 pb-1 animate-fade-in" style={{ animationDelay: '0.25s' }}>
            {searchOpen ? (
              <div className="flex items-center gap-2 border border-mocha-300 rounded-full px-4 py-2 transition-all duration-300">
                <Search size={11} className="text-mocha-400 flex-shrink-0" />
                <input
                  autoFocus
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  placeholder="Search clothing…"
                  className="bg-transparent outline-none text-[10px] tracking-[0.2em] text-mocha-500 placeholder-mocha-300 w-32"
                />
                <button
                  onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                  className="text-mocha-300 hover:text-mocha-500 transition-colors duration-200 leading-none"
                  aria-label="Close search"
                >
                  <span className="text-xs">✕</span>
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center justify-center w-9 h-9 border border-mocha-300 text-mocha-500 rounded-full hover:border-mocha-500 transition-all duration-300"
                aria-label="Search"
              >
                <Search size={13} />
              </button>
            )}
            <button
              onClick={toggleStarred}
              className={`flex items-center justify-center w-9 h-9 rounded-full border transition-all duration-300 ${
                starred
                  ? 'bg-mocha-500 text-mocha-100 border-mocha-500'
                  : 'border-mocha-300 text-mocha-500 hover:border-mocha-500'
              }`}
              aria-label="Starred"
            >
              <span className="text-[13px] leading-none">{starred ? '★' : '☆'}</span>
            </button>
            <button
              onClick={() => setAdd(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.3em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300"
            >
              <IoMdAdd size={13} />
              Add
            </button>
            <button
              onClick={() => setEdit(!edit)}
              className={`flex items-center gap-2 px-5 py-2.5 text-[10px] tracking-[0.3em] uppercase rounded-full border transition-all duration-300 ${
                edit
                  ? 'bg-mocha-500 text-mocha-100 border-mocha-500'
                  : 'border-mocha-300 text-mocha-500 hover:border-mocha-500'
              }`}
            >
              <Pencil size={11} />
              {edit ? 'Done' : 'Edit'}
            </button>
          </div>
        </div>

        {/* Divider */}
        <div className="mt-6 h-px bg-mocha-200 animate-fade-in" style={{ animationDelay: '0.3s' }} />

        {/* Filter pills */}
        <div className="mt-5 flex gap-2 overflow-x-auto pb-1 animate-fade-in" style={{ animationDelay: '0.35s' }}>
          {filters.map(({ label, active, onClick }) => (
            <button
              key={label}
              onClick={onClick}
              className={`px-5 py-2 rounded-full text-[10px] tracking-[0.3em] uppercase whitespace-nowrap transition-all duration-300 ${
                active
                  ? 'bg-mocha-500 text-mocha-100'
                  : 'border border-mocha-200 text-mocha-400 hover:border-mocha-400 hover:text-mocha-500'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

      </div>

      {/* ── Clothing grid ─────────────────────────────────────── */}
      <div
        className="flex-1 overflow-y-auto mt-8 px-4 sm:px-8 lg:px-20 pb-8 animate-fade-in"
        style={{ animationDelay: '0.45s' }}
        onClick={e => { if (e.target === e.currentTarget) setEdit(false); }}
      >
        {hasClothes ? (
          displayedCards.length > 0 ? (
            <CardList
              userID={user.id}
              cards={displayedCards}
              hasClothes={true}
              edit={edit}
              select={false}
              onLongPress={() => setEdit(true)}
              onBackgroundClick={() => setEdit(false)}
            />
          ) : (
            <div className="flex flex-col items-center justify-center py-32 animate-fade-in">
              <p className="font-cormorant text-3xl font-light text-mocha-400">
                {trimmed ? 'No results found.' : 'Nothing here yet.'}
              </p>
              <p className="mt-3 text-[10px] tracking-[0.4em] uppercase text-mocha-300 text-center max-w-xs">
                {trimmed ? 'Try a different search term' : 'Add a piece to get started'}
              </p>
            </div>
          )
        ) : (
          /* Empty state */
          <div className="flex flex-col items-center justify-center py-32 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <span className="font-cormorant text-[6rem] font-light text-mocha-200/60 leading-none select-none">
              00
            </span>
            <p className="mt-2 font-cormorant text-3xl font-light text-mocha-400">
              Your closet is empty.
            </p>
            <p className="mt-3 text-[10px] tracking-[0.4em] uppercase text-mocha-300 text-center max-w-xs">
              Add your first piece to start building your digital wardrobe
            </p>
            <button
              onClick={() => setAdd(true)}
              className="mt-8 flex items-center gap-2 px-7 py-3 bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.35em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300"
            >
              <IoMdAdd size={13} />
              Add Clothing
            </button>
          </div>
        )}
      </div>

      {/* Add clothing modal */}
      {add && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="relative w-full max-w-md bg-off-white-100 rounded-3xl p-8 sm:p-10 shadow-2xl">

            {/* Close button */}
            <button
              onClick={() => setAdd(false)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full border border-mocha-200 text-mocha-400 hover:border-mocha-400 hover:text-mocha-500 transition-all duration-200"
              aria-label="Close"
            >
              <span className="text-xs leading-none">✕</span>
            </button>

            {/* Header */}
            <p className="text-[10px] tracking-[0.5em] uppercase text-mocha-400 mb-3">New Item</p>
            <h2 className="font-cormorant text-4xl font-light text-mocha-500 leading-tight mb-8">
              Add to your<br />
              <span className="italic text-mocha-400">wardrobe.</span>
            </h2>

            <form onSubmit={createClothing} className="space-y-6">

              {/* Photo upload */}
              <div>
                <label className="block text-[10px] tracking-[0.4em] uppercase text-mocha-400 mb-3">
                  Photo
                </label>
                <div className="border border-dashed border-mocha-300 rounded-2xl p-5">
                  <FileUploader
                    multiple={false}
                    handleChange={(e: File) => { setPickerError(''); setFile(e); }}
                    onSizeError={() => setPickerError('Image must be under 50MB.')}
                    types={fileTypes}
                    name="file"
                    label="Upload or drop a photo here"
                    maxSize={50}
                  />
                </div>
                {pickerError && (
                  <p className="mt-2 text-[10px] tracking-[0.25em] text-red-400">
                    {pickerError}
                  </p>
                )}
                {!pickerError && file && (
                  <p className="mt-2 text-[10px] tracking-[0.25em] text-mocha-400 truncate">
                    {file.name}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-mocha-500 text-mocha-100 text-[11px] tracking-[0.3em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300"
              >
                Fold Away
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-mocha-200" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-mocha-300">or</span>
              <div className="flex-1 h-px bg-mocha-200" />
            </div>

            <p className="text-[10px] tracking-[0.3em] uppercase text-mocha-400 text-center mb-3">
              Upload from your favourite store
            </p>
            <button
              disabled
              className="w-full py-3 border border-mocha-200 text-mocha-300 text-[11px] tracking-[0.3em] uppercase rounded-full cursor-not-allowed"
            >
              Uniqlo
            </button>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center">
          <div className="bg-off-white-100 rounded-3xl px-10 py-8 shadow-2xl flex flex-col items-center gap-4">
            <div className="w-7 h-7 rounded-full border-2 border-mocha-300 border-t-mocha-500 animate-spin" />
            <p className="text-[10px] tracking-[0.4em] uppercase text-mocha-400">{loadingStep}</p>
          </div>
        </div>
      )}
    </div>
  );
}
