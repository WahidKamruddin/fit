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
import { Pencil } from "lucide-react";
import PageSkeleton from "@/src/app/components/page-skeleton";


export default function Closet() {
  const user = useUser();

  // Header states
  const [all, setAll] = useState(true);
  const [outerWear, setOuterWear] = useState(false);
  const [tops, setTops] = useState(false);
  const [bottoms, setBottoms] = useState(false);

  // Clothing states
  const [clothingName, setClothingName] = useState('');
  const [clothingColor, setClothingColor] = useState('');
  const [clothingType, setClothingType] = useState('');

  // Fetch data states
  const { cards, hasClothes, addCard } = useCloset();

  // Add data states
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');


  const fileTypes = ["JPG", "JPEG", "PNG", "GIF"];

  // Function to handle background removal
  const handleBackgroundRemoval = async (): Promise<File | null> => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/remove-background`, {
        method: "POST",
        headers: {
          "X-Api-Key": process.env.NEXT_PUBLIC_BG_REMOVER_API_KEY!,
        },
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const processedImageFile = new File([blob], "processed-image.png", { type: "image/png" });
        return processedImageFile;
      } else {
        throw new Error("Failed to remove background");
      }
    } catch (error) {
      console.error("Error removing background:", error);
    }
    return null;
  };

  const createClothing = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdd(false);
    setLoading(true);

    try {
      setLoadingStep('Removing background…');
      const processedFile = await handleBackgroundRemoval();

      if (processedFile && user) {
        const someClothing = new Clothing(clothingName, clothingColor, clothingType);
        setLoadingStep('Uploading image…');
        await addItem(someClothing, processedFile);
      }
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  const addItem = async (someClothing: Clothing, processedFile: File) => {
    const imageID = v4();
    const path = `${user!.id}/${imageID}`;

    await supabase.storage.from('clothing-images').upload(path, processedFile);
    const { data: { publicUrl } } = supabase.storage.from('clothing-images').getPublicUrl(path);
    await addClothing(someClothing, publicUrl, imageID);
  };

  const addClothing = async (someClothing: Clothing, imgUrl: string, imageID: string) => {
    const { data } = await supabase.from('clothes').insert({
      user_id: user!.id,
      name: someClothing.getName(),
      color: someClothing.getColor(),
      type: someClothing.getType(),
      image: imgUrl,
      image_id: imageID,
      material: someClothing.getMaterial(),
      style: someClothing.getStyle(),
    }).select().single();

    if (data) {
      const clothing = new Clothing(data.name, data.color, data.type, data.image, data.material, data.style);
      clothing.starred = data.starred;
      addCard({ clothing, id: data.id, imageId: data.image_id });
    }
  };

  const filterAll = () => { setAll(true); setOuterWear(false); setTops(false); setBottoms(false); };
  const filterOuterWear = () => { setAll(false); setOuterWear(true); setTops(false); setBottoms(false); };
  const filterTops = () => { setAll(false); setOuterWear(false); setTops(true); setBottoms(false); };
  const filterBottoms = () => { setAll(false); setOuterWear(false); setTops(false); setBottoms(true); };

  if (!user) return <PageSkeleton />;

  const firstName = (user.user_metadata?.full_name ?? user.user_metadata?.name)?.split(' ')[0] ?? 'Your';

  const filters = [
    { label: 'All',       active: all,       onClick: filterAll       },
    { label: 'Outerwear', active: outerWear,  onClick: filterOuterWear },
    { label: 'Tops',      active: tops,       onClick: filterTops      },
    { label: 'Bottoms',   active: bottoms,    onClick: filterBottoms   },
  ];

  const activeCards = all        ? cards
    : outerWear ? cards.filter(c => c.clothing.getType() === 'Outerwear')
    : tops      ? cards.filter(c => c.clothing.getType() === 'Top')
    : bottoms   ? cards.filter(c => c.clothing.getType() === 'Bottom')
    : cards;

  return (
    <div className="min-h-screen bg-off-white-100">

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="pt-16 px-4 sm:px-8 lg:px-20">

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
      <div className="mt-8 px-4 sm:px-8 lg:px-20 pb-16 animate-fade-in" style={{ animationDelay: '0.45s' }}>
        {hasClothes ? (
          <CardList
            userID={user.id}
            cards={activeCards}
            hasClothes={activeCards.length > 0}
            edit={edit}
            select={false}
            onLongPress={() => setEdit(true)}
          />
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

              {/* Name */}
              <div>
                <label className="block text-[10px] tracking-[0.4em] uppercase text-mocha-400 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Black wool coat"
                  onChange={(e) => setClothingName(e.target.value)}
                  className="w-full bg-transparent border-b border-mocha-200 py-2.5 text-mocha-500 text-sm placeholder:text-mocha-300/50 focus:outline-none focus:border-mocha-400 transition-colors duration-200"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-[10px] tracking-[0.4em] uppercase text-mocha-400 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Charcoal"
                  onChange={(e) => setClothingColor(e.target.value)}
                  className="w-full bg-transparent border-b border-mocha-200 py-2.5 text-mocha-500 text-sm placeholder:text-mocha-300/50 focus:outline-none focus:border-mocha-400 transition-colors duration-200"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-[10px] tracking-[0.4em] uppercase text-mocha-400 mb-2">
                  Type
                </label>
                <select
                  required
                  onChange={(e) => setClothingType(e.target.value)}
                  className="w-full bg-transparent border-b border-mocha-200 py-2.5 text-mocha-500 text-sm focus:outline-none focus:border-mocha-400 transition-colors duration-200 appearance-none cursor-pointer"
                >
                  <option value="">Select a type</option>
                  <option>Outerwear</option>
                  <option>Top</option>
                  <option>Bottom</option>
                </select>
              </div>

              {/* Photo upload */}
              <div>
                <label className="block text-[10px] tracking-[0.4em] uppercase text-mocha-400 mb-3">
                  Photo
                </label>
                <div className="border border-dashed border-mocha-300 rounded-2xl p-5">
                  <FileUploader
                    multiple={false}
                    handleChange={(e: File) => setFile(e)}
                    types={fileTypes}
                    name="file"
                    label="Upload or drop a photo here"
                  />
                </div>
                {file && (
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
