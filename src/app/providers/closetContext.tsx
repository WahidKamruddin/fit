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
  Name?: string;
  OuterWear: string | null;
  Top: string;
  Bottom: string;
  Shoes: string | null;
  Accessories: string[];
  Dates: string[];
}

interface ClosetContextValue {
  cards: ClothingCard[];
  outfits: OutfitDoc[];
  hasClothes: boolean;
  removeCard: (id: string) => void;
  addCard: (card: ClothingCard) => void;
  addOutfit: (outfit: OutfitDoc) => void;
  removeOutfit: (id: string) => void;
  addOutfitDate: (id: string, date: string) => void;
  removeOutfitDate: (id: string, date: string) => void;
  updateCardName: (id: string, name: string) => void;
  updateCardStarred: (id: string, starred: boolean) => void;
  updateOutfitName: (id: string, name: string) => void;
  updateOutfit: (id: string, updates: Partial<OutfitDoc>) => void;
}

export const ClosetContext = createContext<ClosetContextValue>({
  cards: [],
  outfits: [],
  hasClothes: false,
  removeCard: () => {},
  addCard: () => {},
  addOutfit: () => {},
  removeOutfit: () => {},
  addOutfitDate: () => {},
  removeOutfitDate: () => {},
  updateCardName: () => {},
  updateCardStarred: () => {},
  updateOutfitName: () => {},
  updateOutfit: () => {},
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
          Name: row.name ?? undefined,
          OuterWear: row.outer_wear,
          Top: row.top,
          Bottom: row.bottom,
          Shoes: row.shoes ?? null,
          Accessories: row.accessories ?? [],
          Dates: row.dates ?? [],
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

  const addOutfitDate = (id: string, date: string) => {
    setOutfits((prev) => prev.map((o) => o.id === id ? { ...o, Dates: [...o.Dates, date] } : o));
  };

  const removeOutfitDate = (id: string, date: string) => {
    setOutfits((prev) => prev.map((o) => o.id === id ? { ...o, Dates: o.Dates.filter(d => d !== date) } : o));
  };

  const removeCard = (id: string) => {
    setCards((prev) => {
      const updated = prev.filter((c) => c.id !== id);
      setHasClothes(updated.length > 0);
      return updated;
    });
  };

  const updateCardStarred = (id: string, starred: boolean) => {
    setCards((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      c.clothing.starred = starred;
      return { ...c };
    }));
  };

  const updateCardName = (id: string, name: string) => {
    setCards((prev) => prev.map((c) => {
      if (c.id !== id) return c;
      c.clothing.setFields(name);
      return { ...c };
    }));
  };

  const updateOutfitName = (id: string, name: string) => {
    setOutfits((prev) => prev.map((o) => o.id === id ? { ...o, Name: name } : o));
  };

  const updateOutfit = (id: string, updates: Partial<OutfitDoc>) => {
    setOutfits((prev) => prev.map((o) => o.id === id ? { ...o, ...updates } : o));
  };

  return (
    <ClosetContext.Provider value={{ cards, outfits, hasClothes, removeCard, addCard, addOutfit, removeOutfit, addOutfitDate, removeOutfitDate, updateCardName, updateCardStarred, updateOutfitName, updateOutfit }}>
      {children}
    </ClosetContext.Provider>
  );
}


export const useCloset = () => useContext(ClosetContext);
