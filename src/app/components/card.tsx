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
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editName, setEditName] = useState('');
  const [saving, setSaving] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStartRef = useRef<number>(0);
  const longFiredRef = useRef(false);
  const { removeCard, outfits, removeOutfit, updateOutfit, updateCardName, updateCardStarred } = useCloset();

  const startPress = () => {
    longFiredRef.current = false;
    pressStartRef.current = Date.now();
    setPressing(true);
    pressTimer.current = setTimeout(() => {
      longFiredRef.current = true;
      onLongPress?.();
      setPressing(false);
      pressTimer.current = null;
    }, 500);
  };

  const endPress = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
      pressTimer.current = null;
    }
    const elapsed = Date.now() - pressStartRef.current;
    if (!longFiredRef.current && edit && elapsed < 500 && pressStartRef.current > 0) {
      setEditName(aClothing.clothing.getName());
      setEditModalOpen(true);
    }
    longFiredRef.current = false;
    pressStartRef.current = 0;
    setPressing(false);
  };

  const cancelPress = () => {
    if (pressTimer.current) clearTimeout(pressTimer.current);
    pressTimer.current = null;
    longFiredRef.current = false;
    pressStartRef.current = 0;
    setPressing(false);
  };

  const toggleFavorite = async () => {
    const newStarred = !starred;
    setStarred(newStarred);
    updateCardStarred(aClothing.id, newStarred);
    const { error } = await supabase.from('clothes').update({ starred: newStarred }).eq('id', aClothing.id).eq('user_id', userID);
    if (error) {
      setStarred(!newStarred);
      updateCardStarred(aClothing.id, !newStarred);
    }
  };

  const outfitsToDelete = outfits.filter(o =>
    o.Top === aClothing.id || o.Bottom === aClothing.id
  );

  const outfitsToUpdate = outfits.filter(o =>
    o.Top !== aClothing.id &&
    o.Bottom !== aClothing.id &&
    (
      o.OuterWear === aClothing.id ||
      o.Shoes === aClothing.id ||
      (o.Accessories ?? []).includes(aClothing.id)
    )
  );

  const deleteClothing = async () => {
    if (outfitsToDelete.length > 0) {
      await supabase.from('outfits').delete().in('id', outfitsToDelete.map(o => o.id)).eq('user_id', userID);
      outfitsToDelete.forEach(o => removeOutfit(o.id));
    }
    for (const o of outfitsToUpdate) {
      const patch = {
        outer_wear: o.OuterWear === aClothing.id ? null : o.OuterWear,
        shoes: o.Shoes === aClothing.id ? null : o.Shoes,
        accessories: (o.Accessories ?? []).filter(id => id !== aClothing.id),
      };
      await supabase.from('outfits').update(patch).eq('id', o.id).eq('user_id', userID);
      updateOutfit(o.id, {
        OuterWear: patch.outer_wear,
        Shoes: patch.shoes,
        Accessories: patch.accessories,
      });
    }
    removeCard(aClothing.id);
    if (aClothing.imageId) {
      await supabase.storage.from('clothing-images').remove([`${userID}/${aClothing.imageId}`]);
    }
    await supabase.from('clothes').delete().eq('id', aClothing.id).eq('user_id', userID);
    setConfirmOpen(false);
  };

  const saveName = async () => {
    const trimmed = editName.trim();
    if (!trimmed) return;
    setSaving(true);
    await supabase.from('clothes').update({ name: trimmed }).eq('id', aClothing.id).eq('user_id', userID);
    updateCardName(aClothing.id, trimmed);
    setSaving(false);
    setEditModalOpen(false);
  };

  return (
    <>
      <div
        className={`relative w-44 h-44 rounded-2xl group transition-transform duration-150 cursor-pointer
          ${pressing ? 'scale-95' : 'scale-100'}
          ${edit ? 'animate-wiggle' : ''}`}
        onMouseDown={startPress}
        onMouseUp={endPress}
        onMouseLeave={edit ? undefined : cancelPress}
        onTouchStart={startPress}
        onTouchEnd={endPress}
        onTouchMove={cancelPress}
      >
        {/* Delete button */}
        {edit && (
          <button
            className="absolute -top-2 -right-2 z-20 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white shadow-md transition-transform duration-150 hover:scale-110 active:scale-95 text-xs leading-none font-medium"
            onMouseDown={e => e.stopPropagation()}
            onTouchStart={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); setConfirmOpen(true); }}
            aria-label="Delete"
          >
            ✕
          </button>
        )}

        {confirmOpen && (
          <ConfirmDialog
            title="Delete this piece?"
            body={(() => {
              const del = outfitsToDelete.length;
              const upd = outfitsToUpdate.length;
              if (del > 0 && upd > 0)
                return `This item is required in ${del} outfit${del > 1 ? 's' : ''} (which will be deleted) and optional in ${upd} outfit${upd > 1 ? 's' : ''} (it will be removed from those looks).`;
              if (del > 0)
                return `This item is required in ${del} outfit${del > 1 ? 's' : ''}. Deleting it will also remove those looks.`;
              if (upd > 0)
                return `This item appears as an optional piece in ${upd} outfit${upd > 1 ? 's' : ''}. It will be removed from those looks.`;
              return 'This action cannot be undone.';
            })()}
            onConfirm={deleteClothing}
            onCancel={() => setConfirmOpen(false)}
          />
        )}

        {/* Card surface */}
        <div className="relative w-full h-full bg-white border border-mocha-200/70 rounded-2xl shadow-sm shadow-mocha-200/40 overflow-hidden select-none">

          {/* Favourite button */}
          <button
            className="absolute top-2 left-2 z-20 w-6 h-6 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm border border-mocha-200/50 transition-all duration-200 hover:border-mocha-400"
            onMouseDown={e => e.stopPropagation()}
            onTouchStart={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); toggleFavorite(); }}
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

      {/* Edit name modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="w-full max-w-xs bg-off-white-100 rounded-3xl p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <p className="text-[10px] tracking-[0.5em] uppercase text-mocha-400">Edit Item</p>
              <button
                onClick={() => setEditModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-mocha-200 text-mocha-400 hover:border-mocha-400 transition-all duration-200"
              >
                <span className="text-xs leading-none">✕</span>
              </button>
            </div>
            <input
              type="text"
              autoFocus
              value={editName}
              onChange={e => setEditName(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') saveName(); }}
              placeholder="Item name"
              className="w-full bg-transparent border-b border-mocha-200 focus:border-mocha-400 outline-none text-sm text-mocha-500 placeholder-mocha-200 py-2 mb-6 transition-colors duration-200"
            />
            <button
              onClick={saveName}
              disabled={saving || !editName.trim()}
              className="w-full py-3 bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.3em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-200 disabled:opacity-40"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Card;
