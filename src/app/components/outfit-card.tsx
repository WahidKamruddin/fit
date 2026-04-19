import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseConfig/client";
import { useCloset } from "../providers/closetContext";
import Clothing from "../classes/clothes";
import ConfirmDialog from "./confirm-dialog";

interface ClothingCard {
  clothing: Clothing;
  id: string;
}

interface OutfitDoc {
  id: string;
  Name?: string;
  OuterWear: string | null;
  Top: string;
  Bottom: string;
  Shoes: string | null;
  Accessories: string[];
  Dates: string[];
}

interface OutfitCardProps {
  userID: string | null;
  outfit: OutfitDoc;
  clothes: ClothingCard[];
  canEdit?: boolean;
  onClearDate?: () => void;
  onLongPress?: () => void;
}

const SLOT_W = 144;

const OutfitCard = ({ userID, outfit, clothes, canEdit, onClearDate, onLongPress }: OutfitCardProps) => {
  const { OuterWear, Top, Bottom, Shoes, Accessories } = outfit;
  const { removeOutfit, updateOutfit } = useCloset();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit state — initialised when modal opens
  const [editName, setEditName] = useState('');
  const [editTop, setEditTop] = useState<string | null>(null);
  const [editBottom, setEditBottom] = useState<string | null>(null);
  const [editOuterWear, setEditOuterWear] = useState<string | null>(null);
  const [editShoes, setEditShoes] = useState<string | null>(null);
  const [editAccessories, setEditAccessories] = useState<string[]>([]);

  const [oWImg, setoWImg] = useState<string | undefined>();
  const [topImg, setTopImg] = useState<string | undefined>();
  const [botImg, setBotImg] = useState<string | undefined>();
  const [shoesImg, setShoesImg] = useState<string | undefined>();
  const [accImgs, setAccImgs] = useState<(string | undefined)[]>([]);
  const [pressing, setPressing] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pressStartRef = useRef<number>(0);
  const longFiredRef = useRef(false);

  const deleteOutfit = async () => {
    if (!userID) return;
    removeOutfit(outfit.id);
    await supabase.from('outfits').delete().eq('id', outfit.id).eq('user_id', userID);
    setConfirmOpen(false);
  };

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
    if (!longFiredRef.current && canEdit && elapsed < 500 && pressStartRef.current > 0) {
      setEditName(outfit.Name ?? '');
      setEditTop(outfit.Top);
      setEditBottom(outfit.Bottom);
      setEditOuterWear(outfit.OuterWear);
      setEditShoes(outfit.Shoes);
      setEditAccessories([...(outfit.Accessories ?? [])]);
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

  // Assign clothing to the right slot by type; optional slots toggle off if already selected
  const handlePickClothing = (card: ClothingCard) => {
    const type = card.clothing.getType();
    const id = card.id;
    if (type === 'Top') {
      setEditTop(prev => prev === id ? null : id);
    } else if (type === 'Bottom') {
      setEditBottom(prev => prev === id ? null : id);
    } else if (type === 'Outerwear') {
      setEditOuterWear(prev => prev === id ? null : id);
    } else if (type === 'Shoes') {
      setEditShoes(prev => prev === id ? null : id);
    } else if (type === 'Accessory') {
      setEditAccessories(prev =>
        prev.includes(id) ? prev.filter(a => a !== id) : [...prev, id]
      );
    }
  };

  const saveOutfit = async () => {
    if (!userID || !editTop || !editBottom) return;
    setSaving(true);
    const updates = {
      name: editName.trim() || null,
      outer_wear: editOuterWear,
      top: editTop,
      bottom: editBottom,
      shoes: editShoes,
      accessories: editAccessories,
    };
    await supabase.from('outfits').update(updates).eq('id', outfit.id).eq('user_id', userID);
    updateOutfit(outfit.id, {
      Name: editName.trim() || undefined,
      OuterWear: editOuterWear,
      Top: editTop,
      Bottom: editBottom,
      Shoes: editShoes,
      Accessories: editAccessories,
    });
    setSaving(false);
    setEditModalOpen(false);
  };

  useEffect(() => {
    setoWImg(undefined);
    setTopImg(undefined);
    setBotImg(undefined);
    setShoesImg(undefined);

    const accList = Accessories ?? [];
    const accImages: (string | undefined)[] = accList.map(() => undefined);

    for (const card of clothes) {
      if (OuterWear && card.id === OuterWear) setoWImg(card.clothing.getImageUrl());
      if (card.id === Top) setTopImg(card.clothing.getImageUrl());
      if (card.id === Bottom) setBotImg(card.clothing.getImageUrl());
      if (Shoes && card.id === Shoes) setShoesImg(card.clothing.getImageUrl());
      accList.forEach((aId, i) => {
        if (card.id === aId) accImages[i] = card.clothing.getImageUrl();
      });
    }

    setAccImgs(accImages);
  }, [clothes, OuterWear, Top, Bottom, Shoes, Accessories]);

  const slots: { img: string | undefined; alt: string }[] = [];
  if (OuterWear) slots.push({ img: oWImg, alt: 'outerwear' });
  slots.push({ img: topImg, alt: 'top' });
  slots.push({ img: botImg, alt: 'bottom' });
  if (Shoes) slots.push({ img: shoesImg, alt: 'shoes' });
  (Accessories ?? []).forEach((_, i) => slots.push({ img: accImgs[i], alt: 'accessory' }));

  const cardWidth = Math.max(slots.length, 2) * SLOT_W;

  // Helper: get image URL for an id
  const imgFor = (id: string | null) => id ? clothes.find(c => c.id === id)?.clothing.getImageUrl() : undefined;
  const accImgList = editAccessories.map(id => ({ id, img: imgFor(id) }));

  return (
    <>
      <div
        className={`group relative h-44 rounded-2xl bg-white border border-mocha-200/70 shadow-sm shadow-mocha-200/40 overflow-visible cursor-pointer transition-transform duration-150
          ${pressing ? 'scale-95' : 'scale-100'}
          ${canEdit ? 'animate-wiggle' : ''}`}
        style={{ width: `${cardWidth}px` }}
        onMouseDown={startPress}
        onMouseUp={endPress}
        onMouseLeave={canEdit ? undefined : cancelPress}
        onTouchStart={startPress}
        onTouchEnd={endPress}
        onTouchMove={cancelPress}
      >
        {/* Delete outfit button — suppressed when onClearDate is provided (calendar unassign takes precedence) */}
        {canEdit && !onClearDate && (
          <button
            className="absolute -top-2 -right-2 z-20 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white shadow-md text-xs leading-none font-medium transition-transform duration-150 hover:scale-110 active:scale-95"
            onMouseDown={e => e.stopPropagation()}
            onTouchStart={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); setConfirmOpen(true); }}
            aria-label="Delete outfit"
          >
            ✕
          </button>
        )}

        {confirmOpen && (
          <ConfirmDialog
            title="Delete this look?"
            body="This outfit will be permanently removed. This action cannot be undone."
            onConfirm={deleteOutfit}
            onCancel={() => setConfirmOpen(false)}
          />
        )}

        {/* Clear date button */}
        {onClearDate && (
          <button
            className="absolute -top-2 -right-2 z-20 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white shadow-md text-xs leading-none font-medium transition-transform duration-150 hover:scale-110 active:scale-95"
            onMouseDown={e => e.stopPropagation()}
            onTouchStart={e => e.stopPropagation()}
            onClick={e => { e.stopPropagation(); onClearDate(); }}
            aria-label="Remove from day"
          >
            ✕
          </button>
        )}

        {/* Side-by-side clothing images */}
        <div className="relative flex flex-row w-full h-full overflow-hidden rounded-2xl divide-x divide-mocha-200/40">
          {slots.map((slot, i) => (
            <div key={i} className="flex-shrink-0 flex items-center justify-center p-3" style={{ width: `${SLOT_W}px` }}>
              {slot.img
                ? <img src={slot.img} alt={slot.alt} className="w-full h-full object-contain transition-all duration-300 group-hover:opacity-40" draggable={false} />
                : <div className="w-3 h-3 rounded-full border border-mocha-200/60" />
              }
            </div>
          ))}

          {/* Name overlay — matches clothing card pattern */}
          {outfit.Name && (
            <div className="absolute inset-0 z-10 flex flex-col justify-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
              <p className="font-cormorant text-base font-light text-mocha-500 leading-tight">
                {outfit.Name}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Edit modal */}
      {editModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="w-full max-w-lg bg-off-white-100 rounded-3xl shadow-2xl flex flex-col max-h-[calc(100svh-2rem)] overflow-hidden">

            {/* Header */}
            <div className="flex-shrink-0 flex items-center justify-between px-8 pt-8 pb-4">
              <p className="text-[10px] tracking-[0.5em] uppercase text-mocha-400">Edit Look</p>
              <button
                onClick={() => setEditModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-mocha-200 text-mocha-400 hover:border-mocha-400 transition-all duration-200"
              >
                <span className="text-xs leading-none">✕</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-8 pb-8 space-y-5">

              {/* Name */}
              <input
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                placeholder="Look name (optional)"
                className="w-full bg-transparent border-b border-mocha-200 focus:border-mocha-400 outline-none text-sm text-mocha-500 placeholder-mocha-200 py-2 transition-colors duration-200"
              />

              {/* Required slots */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] tracking-[0.4em] uppercase text-mocha-500 font-medium">Required</span>
                  <div className="flex-1 h-px bg-mocha-200" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {([
                    { label: 'Top', id: editTop },
                    { label: 'Bottom', id: editBottom },
                  ] as { label: string; id: string | null }[]).map(({ label, id }) => (
                    <div
                      key={label}
                      className={`rounded-2xl h-24 flex flex-col justify-center items-center overflow-hidden border transition-all duration-200 ${
                        id ? 'border-mocha-400 bg-white' : 'border-dashed border-mocha-300'
                      }`}
                    >
                      {id && imgFor(id)
                        ? <img src={imgFor(id)} alt={label} className="w-full h-full object-contain p-3" />
                        : <p className="text-[10px] tracking-[0.3em] uppercase text-mocha-300">{label}</p>
                      }
                    </div>
                  ))}
                </div>
              </div>

              {/* Optional slots */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] tracking-[0.4em] uppercase text-mocha-300">Optional</span>
                  <div className="flex-1 h-px bg-mocha-100" />
                </div>
                <div className="grid grid-cols-3 gap-3">
                  {/* Outerwear */}
                  <div className={`rounded-2xl h-20 flex flex-col justify-center items-center overflow-hidden border transition-all duration-200 ${editOuterWear ? 'border-mocha-300 bg-white' : 'border-dashed border-mocha-200'}`}>
                    {editOuterWear && imgFor(editOuterWear)
                      ? <img src={imgFor(editOuterWear)} alt="Outerwear" className="w-full h-full object-contain p-2" />
                      : <p className="text-[9px] tracking-[0.25em] uppercase text-mocha-200">Outerwear</p>
                    }
                  </div>
                  {/* Shoes */}
                  <div className={`rounded-2xl h-20 flex flex-col justify-center items-center overflow-hidden border transition-all duration-200 ${editShoes ? 'border-mocha-300 bg-white' : 'border-dashed border-mocha-200'}`}>
                    {editShoes && imgFor(editShoes)
                      ? <img src={imgFor(editShoes)} alt="Shoes" className="w-full h-full object-contain p-2" />
                      : <p className="text-[9px] tracking-[0.25em] uppercase text-mocha-200">Shoes</p>
                    }
                  </div>
                  {/* Accessories */}
                  <div className={`rounded-2xl h-20 flex flex-col justify-center items-center overflow-hidden border p-1.5 transition-all duration-200 ${accImgList.length > 0 ? 'border-mocha-300 bg-white' : 'border-dashed border-mocha-200'}`}>
                    {accImgList.length > 0 ? (
                      <div className="flex flex-wrap gap-0.5 justify-center items-center w-full h-full">
                        {accImgList.slice(0, 4).map(({ id, img }) => (
                          <img key={id} src={img} alt="accessory" className="w-7 h-7 object-contain" />
                        ))}
                        {accImgList.length > 4 && (
                          <span className="text-[9px] text-mocha-300">+{accImgList.length - 4}</span>
                        )}
                      </div>
                    ) : (
                      <p className="text-[9px] tracking-[0.25em] uppercase text-mocha-200">Acc.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Clothing picker */}
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] tracking-[0.4em] uppercase text-mocha-400">Wardrobe</span>
                  <div className="flex-1 h-px bg-mocha-200" />
                </div>
                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto py-1">
                  {clothes.map(card => {
                    const type = card.clothing.getType();
                    const isSelected =
                      card.id === editTop ||
                      card.id === editBottom ||
                      card.id === editOuterWear ||
                      card.id === editShoes ||
                      editAccessories.includes(card.id);
                    return (
                      <button
                        key={card.id}
                        onClick={() => handlePickClothing(card)}
                        className={`relative w-16 h-16 rounded-xl overflow-hidden border-2 flex-shrink-0 transition-all duration-150 ${
                          isSelected
                            ? 'border-mocha-500 shadow-md scale-105'
                            : 'border-mocha-200/60 hover:border-mocha-400'
                        }`}
                        title={`${card.clothing.getName()} (${type})`}
                      >
                        <img
                          src={card.clothing.getImageUrl()}
                          alt={card.clothing.getName()}
                          className="w-full h-full object-contain p-1 bg-white"
                          draggable={false}
                        />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Save */}
              <button
                onClick={saveOutfit}
                disabled={saving || !editTop || !editBottom}
                className="w-full py-3 bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.3em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-200 disabled:opacity-40"
              >
                {saving ? 'Saving…' : 'Save Look'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OutfitCard;
