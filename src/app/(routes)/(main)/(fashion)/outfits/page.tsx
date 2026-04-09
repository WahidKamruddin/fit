"use client";

import Clothing from "@/src/app/classes/clothes";
import { useMemo, useState } from "react";
import { HiViewGrid } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import { BiSortAlt2 } from "react-icons/bi";
import { TiDelete } from "react-icons/ti";
import { supabase } from "@/src/app/supabaseConfig/client";
import CardList from "@/src/app/components/card-list";
import { useUser } from "@/src/app/auth/auth";
import NotLoggedIn from "@/src/app/components/not-logged-in";
import OutfitCard from "@/src/app/components/outfit-card";
import { useCloset } from "@/src/app/providers/closetContext";
import { Pencil } from "lucide-react";


export default function Outfit() {
  const user = useUser();

  const [outerWear, setOuterWear] = useState<[Clothing, string] | null>(null);
  const [top, setTop] = useState<[Clothing, string] | null>(null);
  const [bottom, setBottom] = useState<[Clothing, string] | null>(null);

  const { cards, hasClothes, outfits } = useCloset();

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
    await supabase.from('outfits').insert({
      user_id: user.id,
      outer_wear: outerWear[1],
      top: top[1],
      bottom: bottom[1],
      date: null,
    });
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
        <OutfitCard userID={user?.id ?? null} outfit={something} clothes={cards} canEdit={edit} />
      </div>
    ));
  }, [outfits, cards, edit]);

  if (!user) return <NotLoggedIn />;

  return (
    <div className="min-h-screen pt-16 bg-off-white-100 text-black">
      <div className="px-4 sm:px-8 lg:px-20">
        <h1 className="text-3xl sm:text-4xl">
          {(user.user_metadata?.full_name ?? user.user_metadata?.name)?.split(" ")[0]}{"'s"} Outfits
        </h1>

        {/* Header */}
        <div className="mt-5 flex flex-wrap gap-4 justify-end items-center">
          <div className="flex items-center gap-2 sm:gap-4">
            <div className="mt-2 bg-mocha-150 text-white py-2 px-3 rounded-lg flex items-center gap-1 cursor-not-allowed text-sm">
              Sort <BiSortAlt2 className="text-lg text-white" />
            </div>
            <div className="p-2 mt-2 bg-mocha-150 rounded-3xl cursor-not-allowed">
              <HiViewGrid className="text-xl text-white" />
            </div>
            <button onClick={() => setAdd(true)} className="p-2 mt-2 bg-mocha-150 rounded-3xl">
              <IoMdAdd className="text-xl text-white" />
            </button>
            <button onClick={() => setEdit(!edit)} className="p-2 mt-2 bg-mocha-150 rounded-3xl">
              <Pencil size={18} className="text-white"/>
            </button>
          </div>
        </div>

        {/* Outfit cards */}
        <div className="mt-10 pb-12 flex flex-wrap justify-center gap-4">
          {memoizedOutfits}
        </div>
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
