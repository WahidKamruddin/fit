"use client";

import Clothing from "@/src/app/classes/clothes";
import { useMemo, useState } from "react";
import { IoMdAdd } from "react-icons/io";
import { supabase } from "@/src/app/supabaseConfig/client";
import CardList from "@/src/app/components/card-list";
import { useUser } from "@/src/app/auth/auth";
import OutfitCard from "@/src/app/components/outfit-card";
import { useCloset } from "@/src/app/providers/closetContext";
import { Pencil } from "lucide-react";
import PageSkeleton from "@/src/app/components/page-skeleton";


export default function Outfit() {
  const user = useUser();

  const [outerWear, setOuterWear] = useState<[Clothing, string] | null>(null);
  const [top, setTop] = useState<[Clothing, string] | null>(null);
  const [bottom, setBottom] = useState<[Clothing, string] | null>(null);

  const { cards, hasClothes, outfits, addOutfit: addOutfitToContext } = useCloset();

  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);

  const handleSelect = (item: Clothing, id: string) => {
    const type = item.getType();
    if (type === "Outerwear") setOuterWear([item, id]);
    else if (type === "Top") setTop([item, id]);
    else if (type === "Bottom") setBottom([item, id]);
  };

  const addOutfit = async () => {
    if (!user || !outerWear || !top || !bottom) return;
    const { data } = await supabase.from('outfits').insert({
      user_id: user.id,
      outer_wear: outerWear[1],
      top: top[1],
      bottom: bottom[1],
      date: null,
    }).select().single();

    if (data) {
      addOutfitToContext({
        id: data.id,
        OuterWear: data.outer_wear,
        Top: data.top,
        Bottom: data.bottom,
        Shoes: data.shoes ?? null,
        Accessories: data.accessories ?? [],
        Date: data.date,
      });
    }
  };

  const createOutfit = () => {
    if (outerWear && top && bottom) {
      addOutfit();
      exit();
    }
  };

  const exit = () => {
    setAdd(false);
    setOuterWear(null);
    setTop(null);
    setBottom(null);
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
          <div className="relative w-full max-w-2xl bg-off-white-100 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6">

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

            {/* Preview slots */}
            <div className="grid grid-cols-3 gap-3 sm:gap-6">
              {[
                { label: 'Outerwear', item: outerWear },
                { label: 'Top',       item: top       },
                { label: 'Bottom',    item: bottom    },
              ].map(({ label, item }) => (
                <div key={label} className="border border-dashed border-mocha-300 rounded-2xl aspect-square flex flex-col justify-center items-center overflow-hidden">
                  {item ? (
                    <img alt={label} src={item[0].getImageUrl()} className="w-full h-full object-contain p-3" />
                  ) : (
                    <p className="text-[10px] tracking-[0.3em] uppercase text-mocha-300">{label}</p>
                  )}
                </div>
              ))}
            </div>

            {/* Card picker */}
            <div className="h-40 sm:h-52 overflow-y-auto rounded-2xl border border-mocha-200">
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
              disabled={!outerWear || !top || !bottom}
              className="w-full py-3.5 bg-mocha-500 text-mocha-100 text-[11px] tracking-[0.3em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Save Outfit
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
