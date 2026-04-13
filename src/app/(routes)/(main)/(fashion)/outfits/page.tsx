"use client";

import Clothing from "@/src/app/classes/clothes";
import { useMemo, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { supabase } from "@/src/app/supabaseConfig/client";
import CardList from "@/src/app/components/card-list";
import { useUser } from "@/src/app/auth/auth";
import OutfitCard from "@/src/app/components/outfit-card";
import { useCloset } from "@/src/app/providers/closetContext";
import { Pencil, Sparkles } from "lucide-react";
import PageSkeleton from "@/src/app/components/page-skeleton";
import OutfitGeneratorModal from "@/src/app/components/outfit-generator-modal";
import type { OutfitDoc } from "@/src/app/types/outfit";


export default function Outfit() {
  const user = useUser();

  const [outerWear, setOuterWear] = useState<[Clothing, string] | null>(null);
  const [top, setTop] = useState<[Clothing, string] | null>(null);
  const [bottom, setBottom] = useState<[Clothing, string] | null>(null);
  const [shoes, setShoes] = useState<[Clothing, string] | null>(null);
  const [accessories, setAccessories] = useState<[Clothing, string][]>([]);

  const { cards, hasClothes, outfits, addOutfit: addOutfitToContext } = useCloset();

  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [aiModal, setAiModal] = useState(false);

  const handleSelect = (item: Clothing, id: string) => {
    const type = item.getType();
    if (type === "Outerwear") setOuterWear([item, id]);
    else if (type === "Top") setTop([item, id]);
    else if (type === "Bottom") setBottom([item, id]);
    else if (type === "Shoes") setShoes([item, id]);
    else if (type === "Accessory") {
      setAccessories(prev => {
        const exists = prev.some(([, aId]) => aId === id);
        return exists
          ? prev.filter(([, aId]) => aId !== id)
          : [...prev, [item, id]];
      });
    }
  };

  const addOutfit = async () => {
    if (!user || !top || !bottom) return;
    const { data } = await supabase.from('outfits').insert({
      user_id: user.id,
      outer_wear: outerWear?.[1] ?? null,
      top: top[1],
      bottom: bottom[1],
      shoes: shoes?.[1] ?? null,
      accessories: accessories.map(([, id]) => id),
      date: null,
    }).select().single();

    if (data) {
      addOutfitToContext({
        id: data.id,
        OuterWear: data.outer_wear ?? null,
        Top: data.top,
        Bottom: data.bottom,
        Shoes: data.shoes ?? null,
        Accessories: data.accessories ?? [],
        Date: data.date,
      });
    }
  };

  const createOutfit = () => {
    if (top && bottom) {
      addOutfit();
      exit();
    }
  };

  const exit = () => {
    setAdd(false);
    setOuterWear(null);
    setTop(null);
    setBottom(null);
    setShoes(null);
    setAccessories([]);
  };

  const memoizedOutfits = useMemo(() => {
    return outfits?.map((something) => (
      <div key={something.id}>
        <OutfitCard
          userID={user?.id ?? null}
          outfit={something}
          clothes={cards}
          canEdit={edit}
          onLongPress={() => setEdit(true)}
        />
      </div>
    ));
  }, [outfits, cards, edit]);

  if (!user) return <PageSkeleton />;

  const firstName = (user.user_metadata?.full_name ?? user.user_metadata?.name)?.split(' ')[0] ?? 'Your';

  return (
    <div className="h-screen flex flex-col overflow-hidden pt-16 bg-off-white-100">

      {/* ── Page header ─────────────────────────────────────── */}
      <div className="flex-shrink-0 px-4 sm:px-8 lg:px-20">
        <div className="pt-8">
          {/* Overline */}
          <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.05s' }}>
            <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">Looks</span>
            <div className="w-8 h-px bg-mocha-300" />
            <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">
              {outfits.length} {outfits.length === 1 ? 'outfit' : 'outfits'}
            </span>
          </div>

          {/* Title + actions */}
          <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
            <h1
              className="font-cormorant font-light text-mocha-500 leading-[0.95] animate-fade-in-up"
              style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', animationDelay: '0.15s' }}
            >
              {firstName}{"'s"}<br />
              <span className="italic text-mocha-400">Outfits.</span>
            </h1>

            <div className="flex items-center gap-2 sm:gap-3 pb-1 animate-fade-in" style={{ animationDelay: '0.25s' }}>
              <button
                onClick={() => setAdd(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.3em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300"
              >
                <IoMdAdd size={13} />
                New Look
              </button>
              <button
                onClick={() => setAiModal(true)}
                className="flex items-center gap-2 px-5 py-2.5 border border-mocha-300 text-mocha-500 text-[10px] tracking-[0.3em] uppercase rounded-full hover:border-mocha-500 transition-all duration-300"
              >
                <Sparkles size={11} />
                Generate
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
        </div>
      </div>

      {/* ── Outfit grid / empty state ────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-20">
        {outfits.length > 0 ? (
          <div className="mt-8 pb-8 flex flex-wrap justify-center gap-6 animate-fade-in" style={{ animationDelay: '0.35s' }}>
            {memoizedOutfits}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-32 animate-fade-in" style={{ animationDelay: '0.4s' }}>
            <span className="font-cormorant text-[6rem] font-light text-mocha-200/60 leading-none select-none">
              00
            </span>
            <p className="mt-2 font-cormorant text-3xl font-light text-mocha-400">
              No looks saved yet.
            </p>
            <p className="mt-3 text-[10px] tracking-[0.4em] uppercase text-mocha-300 text-center max-w-xs">
              Build your first outfit from the pieces in your wardrobe
            </p>
            <button
              onClick={() => setAdd(true)}
              className="mt-8 flex items-center gap-2 px-7 py-3 bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.35em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300"
            >
              <IoMdAdd size={13} />
              Build a Look
            </button>
          </div>
        )}
      </div>

      {/* Add outfit modal */}
      {add && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="relative w-full max-w-2xl bg-off-white-100 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-5 max-h-[calc(100svh-2rem)] overflow-y-auto">

            {/* Close */}
            <button onClick={exit} className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full border border-mocha-200 text-mocha-400 hover:border-mocha-400 hover:text-mocha-500 transition-all duration-200" aria-label="Close">
              <span className="text-xs leading-none">✕</span>
            </button>

            <div>
              <p className="text-[10px] tracking-[0.5em] uppercase text-mocha-400 mb-2">New Look</p>
              <h2 className="font-cormorant text-4xl font-light text-mocha-500">
                Build an <span className="italic text-mocha-400">outfit.</span>
              </h2>
            </div>

            {/* ── Required items ─────────────────────────────── */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-[9px] tracking-[0.4em] uppercase text-mocha-500 font-medium">Required</span>
                <div className="flex-1 h-px bg-mocha-200" />
              </div>
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {([
                  { label: 'Top', item: top },
                  { label: 'Bottom', item: bottom },
                ] as { label: string; item: [Clothing, string] | null }[]).map(({ label, item }) => (
                  <div
                    key={label}
                    className={`rounded-2xl h-28 flex flex-col justify-center items-center overflow-hidden transition-all duration-200 ${
                      item ? 'border border-mocha-400 bg-white' : 'border border-dashed border-mocha-300'
                    }`}
                  >
                    {item ? (
                      <img alt={label} src={item[0].getImageUrl()} className="w-full h-full object-contain p-3" />
                    ) : (
                      <p className="text-[10px] tracking-[0.3em] uppercase text-mocha-300">{label}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* ── Optional items ─────────────────────────────── */}
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-[9px] tracking-[0.4em] uppercase text-mocha-300">Optional</span>
                <div className="flex-1 h-px bg-mocha-100" />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {/* Outerwear */}
                <div className={`border border-dashed rounded-2xl h-20 flex flex-col justify-center items-center overflow-hidden transition-all duration-200 ${outerWear ? 'border-mocha-300 bg-white' : 'border-mocha-200'}`}>
                  {outerWear ? (
                    <img alt="Outerwear" src={outerWear[0].getImageUrl()} className="w-full h-full object-contain p-2" />
                  ) : (
                    <p className="text-[9px] tracking-[0.25em] uppercase text-mocha-200">Outerwear</p>
                  )}
                </div>
                {/* Shoes */}
                <div className={`border border-dashed rounded-2xl h-20 flex flex-col justify-center items-center overflow-hidden transition-all duration-200 ${shoes ? 'border-mocha-300 bg-white' : 'border-mocha-200'}`}>
                  {shoes ? (
                    <img alt="Shoes" src={shoes[0].getImageUrl()} className="w-full h-full object-contain p-2" />
                  ) : (
                    <p className="text-[9px] tracking-[0.25em] uppercase text-mocha-200">Shoes</p>
                  )}
                </div>
                {/* Accessories */}
                <div className={`border border-dashed rounded-2xl h-20 flex flex-col justify-center items-center overflow-hidden transition-all duration-200 p-2 ${accessories.length > 0 ? 'border-mocha-300 bg-white' : 'border-mocha-200'}`}>
                  {accessories.length > 0 ? (
                    <div className="flex flex-wrap gap-0.5 justify-center items-center w-full h-full">
                      {accessories.slice(0, 4).map(([item, id]) => (
                        <img key={id} src={item.getImageUrl()} alt="accessory" className="w-8 h-8 object-contain" />
                      ))}
                      {accessories.length > 4 && (
                        <span className="text-[9px] text-mocha-300">+{accessories.length - 4}</span>
                      )}
                    </div>
                  ) : (
                    <p className="text-[9px] tracking-[0.25em] uppercase text-mocha-200">Accessories</p>
                  )}
                </div>
              </div>
            </div>

            {/* Card picker */}
            <div className="h-40 sm:h-48 overflow-y-auto rounded-2xl border border-mocha-200">
              <CardList
                userID={user.id}
                cards={cards}
                hasClothes={hasClothes}
                edit={false}
                select={true}
                handleOuterWear={handleSelect}
              />
            </div>

            <button
              onClick={createOutfit}
              disabled={!top || !bottom}
              className="w-full py-3.5 bg-mocha-500 text-mocha-100 text-[11px] tracking-[0.3em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save Outfit
            </button>
          </div>
        </div>
      )}

      {/* AI Outfit Generator Modal */}
      {aiModal && (
        <OutfitGeneratorModal
          userId={user.id}
          cards={cards}
          onClose={() => setAiModal(false)}
          onSave={(doc: OutfitDoc) => addOutfitToContext(doc)}
        />
      )}
    </div>
  );
}
