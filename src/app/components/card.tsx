import { FaStar } from "react-icons/fa";
import { AiOutlineStar } from "react-icons/ai";
import { useState, useRef } from "react";
import { supabase } from "../supabaseConfig/client";
import { useCloset } from "../providers/closetContext";
import Clothing from "../classes/clothes";
import ConfirmDialog from "./confirm-dialog";

interface CardProps {
  userID: string;
  aClothing: { clothing: Clothing; id: string; imageId: string | null };
  edit: boolean;
  select: boolean;
  handleOuterWear?: (item: Clothing, id: string) => void;
  onLongPress?: () => void;
}

const Card = ({ userID, aClothing, edit, select, handleOuterWear, onLongPress }: CardProps) => {
  const [starred, setStarred] = useState(aClothing.clothing.starred);
  const [pressing, setPressing] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { removeCard, outfits, removeOutfit } = useCloset();

  const startPress = () => {
    setPressing(true);
    pressTimer.current = setTimeout(() => {
      onLongPress?.();
      setPressing(false);
    }, 500);
  };

  const cancelPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    setPressing(false);
  };

  const toggleFavorite = async () => {
    const newStarred = !starred;
    setStarred(newStarred);
    await supabase.from('clothes').update({ starred: newStarred }).eq('id', aClothing.id);
  };

  const affectedOutfits = outfits.filter(o =>
    o.Top === aClothing.id ||
    o.Bottom === aClothing.id ||
    o.OuterWear === aClothing.id ||
    o.Shoes === aClothing.id ||
    (o.Accessories ?? []).includes(aClothing.id)
  );

  const deleteClothing = async () => {
    if (affectedOutfits.length > 0) {
      await supabase.from('outfits').delete().in('id', affectedOutfits.map(o => o.id));
      affectedOutfits.forEach(o => removeOutfit(o.id));
    }
    removeCard(aClothing.id);
    if (aClothing.imageId) {
      await supabase.storage.from('clothing-images').remove([`${userID}/${aClothing.imageId}`]);
    }
    await supabase.from('clothes').delete().eq('id', aClothing.id);
    setConfirmOpen(false);
  };

  return (
    <div
      className={`relative w-44 h-44 rounded-2xl group transition-transform duration-150 cursor-pointer
        ${pressing ? 'scale-95' : 'scale-100'}
        ${edit ? 'animate-wiggle' : ''}`}
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchMove={cancelPress}
    >
      {/* Delete button */}
      {edit && (
        <button
          className="absolute -top-2 -right-2 z-20 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform duration-150 hover:scale-110 active:scale-95 text-xs leading-none font-medium"
          onClick={() => setConfirmOpen(true)}
          aria-label="Delete"
        >
          ✕
        </button>
      )}

      {confirmOpen && (
        <ConfirmDialog
          title="Delete this piece?"
          body={
            affectedOutfits.length > 0
              ? `This item appears in ${affectedOutfits.length} outfit${affectedOutfits.length > 1 ? 's' : ''}. Deleting it will also remove those looks.`
              : "This action cannot be undone."
          }
          onConfirm={deleteClothing}
          onCancel={() => setConfirmOpen(false)}
        />
      )}

      {/* Card surface */}
      <div className="relative w-full h-full bg-white border border-mocha-200/70 rounded-2xl shadow-sm shadow-mocha-200/40 overflow-hidden select-none">

        {/* Favourite button */}
        <button
          className="absolute top-2 left-2 z-20 w-6 h-6 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-mocha-200/50 transition-all duration-200 hover:border-mocha-400"
          onClick={toggleFavorite}
          aria-label="Favourite"
        >
          {starred
            ? <FaStar size={11} className="text-amber-400" />
            : <AiOutlineStar size={11} className="text-mocha-300" />}
        </button>

        {/* Clothing image */}
        <img
          alt={aClothing.clothing.getName()}
          src={aClothing.clothing.getImageUrl()}
          className="w-full h-full object-contain p-4 transition-all duration-300 group-hover:scale-105 group-hover:opacity-40"
          draggable={false}
        />

        {/* Hover overlay */}
        {select ? (
          <button
            onClick={() => handleOuterWear?.(aClothing.clothing, aClothing.id)}
            className="absolute inset-0 z-10 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          >
            <p className="font-cormorant text-base font-light text-mocha-500 leading-tight text-left">
              {aClothing.clothing.getName()}
            </p>
            <p className="text-[9px] tracking-[0.3em] uppercase text-mocha-400 mt-0.5">
              {aClothing.clothing.getType()}
            </p>
          </button>
        ) : (
          <div className="absolute inset-0 z-10 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
            <p className="font-cormorant text-base font-light text-mocha-500 leading-tight">
              {aClothing.clothing.getName()}
            </p>
            <p className="text-[9px] tracking-[0.3em] uppercase text-mocha-400 mt-0.5">
              {aClothing.clothing.getType()}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
