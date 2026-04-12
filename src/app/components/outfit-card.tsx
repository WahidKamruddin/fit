import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseConfig/client";
import { useCloset } from "../providers/closetContext";
import Clothing from "../classes/clothes";

interface ClothingCard {
  clothing: Clothing;
  id: string;
}

interface OutfitDoc {
  id: string;
  OuterWear: string;
  Top: string;
  Bottom: string;
  Date: string | null;
}

interface OutfitCardProps {
  userID: string | null;
  outfit: OutfitDoc;
  clothes: ClothingCard[];
  canEdit?: boolean;
  onClearDate?: () => void;
  onLongPress?: () => void;
}

const OutfitCard = ({ userID, outfit, clothes, canEdit, onClearDate, onLongPress }: OutfitCardProps) => {
  const { OuterWear, Top, Bottom } = outfit;
  const { removeOutfit } = useCloset();

  const [oWImg, setoWImg] = useState<string | undefined>();
  const [topImg, setTopImg] = useState<string | undefined>();
  const [botImg, setBotImg] = useState<string | undefined>();
  const [pressing, setPressing] = useState(false);
  const pressTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const deleteOutfit = async () => {
    if (!userID) return;
    removeOutfit(outfit.id);
    await supabase.from('outfits').delete().eq('id', outfit.id);
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
    for (const card of clothes) {
      if (card.id === OuterWear) setoWImg(card.clothing.getImageUrl());
      if (card.id === Top) setTopImg(card.clothing.getImageUrl());
      if (card.id === Bottom) setBotImg(card.clothing.getImageUrl());
    }
  }, [clothes, OuterWear, Top, Bottom]);

  return (
    <div
      className={`relative w-72 h-36 rounded-2xl bg-white border border-mocha-200/70 shadow-sm shadow-mocha-200/40 overflow-visible cursor-pointer transition-transform duration-150
        ${pressing ? 'scale-95' : 'scale-100'}
        ${canEdit ? 'animate-wiggle' : ''}`}
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
          onClick={deleteOutfit}
          aria-label="Delete outfit"
        >
          ✕
        </button>
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

        {/* Outerwear slot */}
        <div className="flex-1 flex items-center justify-center p-1">
          {oWImg
            ? <img src={oWImg} alt="outerwear" className="w-24 h-24 object-contain" />
            : <div className="w-3 h-3 rounded-full border border-mocha-200/60" />
          }
        </div>

        {/* Top slot */}
        <div className="flex-1 flex items-center justify-center p-1">
          {topImg
            ? <img src={topImg} alt="top" className="w-24 h-24 object-contain" />
            : <div className="w-3 h-3 rounded-full border border-mocha-200/60" />
          }
        </div>

        {/* Bottom slot */}
        <div className="flex-1 flex items-center justify-center p-1">
          {botImg
            ? <img src={botImg} alt="bottom" className="w-24 h-24 object-contain" />
            : <div className="w-3 h-3 rounded-full border border-mocha-200/60" />
          }
        </div>

      </div>
    </div>
  );
};

export default OutfitCard;
