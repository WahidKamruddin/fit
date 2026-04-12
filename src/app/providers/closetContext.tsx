"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseConfig/client";
import { useUser } from "../auth/auth";
import Clothing from "../classes/clothes";

interface ClothingCard {
  clothing: Clothing;
  id: string;
  imageId: string | null;
}

interface OutfitDoc {
  id: string;
  OuterWear: string;
  Top: string;
  Bottom: string;
  Shoes: string | null;
  Accessories: string[];
  Date: string | null;
}

interface ClosetContextValue {
  cards: ClothingCard[];
  outfits: OutfitDoc[];
  hasClothes: boolean;
  removeCard: (id: string) => void;
  addCard: (card: ClothingCard) => void;
  addOutfit: (outfit: OutfitDoc) => void;
  removeOutfit: (id: string) => void;
  updateOutfitDate: (id: string, date: string | null) => void;
}

export const ClosetContext = createContext<ClosetContextValue>({
  cards: [],
  outfits: [],
  hasClothes: false,
  removeCard: () => {},
  addCard: () => {},
  addOutfit: () => {},
  removeOutfit: () => {},
  updateOutfitDate: () => {},
});

export function ClosetProvider({ children }: { children: React.ReactNode }) {
  const user = useUser();
  const [cards, setCards] = useState<ClothingCard[]>([]);
  const [outfits, setOutfits] = useState<OutfitDoc[]>([]);
  const [hasClothes, setHasClothes] = useState(false);

  useEffect(() => {
    if (!user) {
      setCards([]);
      setOutfits([]);
      setHasClothes(false);
      return;
    }

    const uid = user.id;

    const fetchAll = async () => {
      const { data: clothesData } = await supabase
        .from('clothes')
        .select('*')
        .eq('user_id', uid);

      if (clothesData) {
        const clothesArr: ClothingCard[] = clothesData.map((row) => {
          // Handle legacy string colors and new [name, hex] tuples
          const color: [string, string] = Array.isArray(row.color)
            ? row.color
            : [String(row.color || 'Unknown'), '#808080'];
          const clothing = new Clothing(
            row.name, color, row.type, row.image,
            row.material, row.style,
            row.comfort, row.warmth, row.weather, row.vibe, row.size,
          );
          clothing.starred = row.starred;
          return { clothing, id: row.id, imageId: row.image_id ?? null };
        });
        setCards(clothesArr);
        setHasClothes(clothesArr.length > 0);
      }

      const { data: outfitsData } = await supabase
        .from('outfits')
        .select('*')
        .eq('user_id', uid);

      if (outfitsData) {
        const outfitArr: OutfitDoc[] = outfitsData.map((row) => ({
          id: row.id,
          OuterWear: row.outer_wear,
          Top: row.top,
          Bottom: row.bottom,
          Shoes: row.shoes ?? null,
          Accessories: row.accessories ?? [],
          Date: row.date,
        }));
        setOutfits(outfitArr);
      }
    };

    fetchAll();

    // Real-time subscription — refetch on any change to clothes or outfits
    const channel = supabase
      .channel(`closet-${uid}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'clothes', filter: `user_id=eq.${uid}` }, fetchAll)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'outfits', filter: `user_id=eq.${uid}` }, fetchAll)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const addCard = (card: ClothingCard) => {
    setCards((prev) => {
      const updated = [...prev, card];
      setHasClothes(true);
      return updated;
    });
  };

  const addOutfit = (outfit: OutfitDoc) => {
    setOutfits((prev) => [...prev, outfit]);
  };

  const removeOutfit = (id: string) => {
    setOutfits((prev) => prev.filter((o) => o.id !== id));
  };

  const updateOutfitDate = (id: string, date: string | null) => {
    setOutfits((prev) => prev.map((o) => o.id === id ? { ...o, Date: date } : o));
  };

  const removeCard = (id: string) => {
    setCards((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      setHasClothes(updated.length > 0);
      return updated;
    });
  };

  return (
    <ClosetContext.Provider value={{ cards, outfits, hasClothes, removeCard, addCard, addOutfit, removeOutfit, updateOutfitDate }}>
      {children}
    </ClosetContext.Provider>
  );
}

export const useCloset = () => useContext(ClosetContext);
