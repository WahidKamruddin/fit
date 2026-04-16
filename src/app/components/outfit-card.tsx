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

const SLOT_W = 144; // px per slot — matches clothing card image area (w-44 = 176px minus p-4 padding)

const OutfitCard = ({ userID, outfit, clothes, canEdit, onClearDate, onLongPress }: OutfitCardProps) => {
  const { OuterWear, Top, Bottom, Shoes, Accessories } = outfit;
  const { removeOutfit } = useCloset();

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [oWImg, setoWImg] = useState<string | undefined>();
  const [topImg, setTopImg] = useState<string | undefined>();
  const [botImg, setBotImg] = useState<string | undefined>();
  const [shoesImg, setShoesImg] = useState<string | undefined>();
  const [accImgs, setAccImgs] = useState<(string | undefined)[]>([]);
  const [pressing, setPressing] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const deleteOutfit = async () => {
    if (!userID) return;
    removeOutfit(outfit.id);
    await supabase.from('outfits').delete().eq('id', outfit.id).eq('user_id', userID);
    setConfirmOpen(false);
  };

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

  // Build slots: only include optional categories if they're set
  const slots: { img: string | undefined; alt: string }[] = [];
  if (OuterWear) slots.push({ img: oWImg, alt: 'outerwear' });
  slots.push({ img: topImg, alt: 'top' });
  slots.push({ img: botImg, alt: 'bottom' });
  if (Shoes) slots.push({ img: shoesImg, alt: 'shoes' });
  (Accessories ?? []).forEach((_, i) => slots.push({ img: accImgs[i], alt: 'accessory' }));

  const cardWidth = Math.max(slots.length, 2) * SLOT_W;

  return (
    <div
      className={`relative h-44 rounded-2xl bg-white border border-mocha-200/70 shadow-sm shadow-mocha-200/40 overflow-visible cursor-pointer transition-transform duration-150
        ${pressing ? 'scale-95' : 'scale-100'}
        ${canEdit ? 'animate-wiggle' : ''}`}
      style={{ width: `${cardWidth}px` }}
      onMouseDown={startPress}
      onMouseUp={cancelPress}
      onMouseLeave={cancelPress}
      onTouchStart={startPress}
      onTouchEnd={cancelPress}
      onTouchMove={cancelPress}
    >
      {/* Delete outfit button */}
      {canEdit && (
        <button
          className="absolute -top-2 -right-2 z-20 w-6 h-6 flex items-center justify-center rounded-full bg-red-500 text-white shadow-md text-xs leading-none font-medium transition-transform duration-150 hover:scale-110 active:scale-95"
          onClick={() => setConfirmOpen(true)}
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
          onClick={onClearDate}
          aria-label="Remove from day"
        >
          ✕
        </button>
      )}

      {/* Side-by-side clothing images */}
      <div className="flex flex-row w-full h-full overflow-hidden rounded-2xl divide-x divide-mocha-200/40">
        {slots.map((slot, i) => (
          <div key={i} className="flex-shrink-0 flex items-center justify-center p-3" style={{ width: `${SLOT_W}px` }}>
            {slot.img
              ? <img src={slot.img} alt={slot.alt} className="w-full h-full object-contain" draggable={false} />
              : <div className="w-3 h-3 rounded-full border border-mocha-200/60" />
            }
          </div>
        ))}
      </div>
    </div>
  );
};

export default OutfitCard;
