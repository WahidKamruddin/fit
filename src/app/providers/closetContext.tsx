"use client"

import { createContext, useContext, useEffect, useState } from "react";
import { onSnapshot, collection, query } from "firebase/firestore";
import { User } from "firebase/auth";
import { db } from "../firebaseConfig/clientApp";
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
    if (!user) return;

    const uid = user.uid;

    const clothesQuery = query(collection(db, `users/${uid}/clothes`));
    const unsubClothes = onSnapshot(clothesQuery, (snapshot) => {
      const clothesArr: ClothingCard[] = [];

      snapshot.forEach((doc) => {
        const data = doc.data();
        const clothing = new Clothing(
          data.Name,
          data.Color,
          data.Type,
          data.Image,
          data.Style
        );
        clothesArr.push({ clothing, id: doc.id });
      });

      setCards(clothesArr);
      setHasClothes(clothesArr.length > 0);
    });

    const outfitsQuery = query(collection(db, `users/${uid}/outfits`));
    const unsubOutfits = onSnapshot(outfitsQuery, (snapshot) => {
      const outfitArr: OutfitDoc[] = [];

      snapshot.forEach((doc) => {
        outfitArr.push({ ...doc.data(), id: doc.id } as OutfitDoc);
      });

      setOutfits(outfitArr);
    });

    return () => {
      unsubClothes();
      unsubOutfits();
    };
  }, [user]);

  return (
    <ClosetContext.Provider value={{ cards, outfits, hasClothes }}>
      {children}
    </ClosetContext.Provider>
  );
}

export const useCloset = () => useContext(ClosetContext);
