"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../supabaseConfig/client";
import { useUser } from "../auth/auth";
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

interface ClosetContextValue {
  cards: ClothingCard[];
  outfits: OutfitDoc[];
  hasClothes: boolean;
}

export const ClosetContext = createContext<ClosetContextValue>({
  cards: [],
  outfits: [],
  hasClothes: false,
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
          const clothing = new Clothing(row.name, row.color, row.type, row.image, row.material, row.style);
          clothing.starred = row.starred;
          return { clothing, id: row.id };
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

  return (
    <ClosetContext.Provider value={{ cards, outfits, hasClothes }}>
      {children}
    </ClosetContext.Provider>
  );
}

export const useCloset = () => useContext(ClosetContext);
