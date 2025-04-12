// context/ClosetContext.tsx

"use client"
import { createContext, useContext, useEffect, useState } from "react";
import { onSnapshot, collection, query } from "firebase/firestore";
import { db } from "../firebaseConfig/clientApp";
import { useUser } from "../auth/auth"; // or your auth
import Clothing from "../classes/clothes";

export const ClosetContext = createContext<any>(null);

export function ClosetProvider({ children }: { children: React.ReactNode }) {
    const user = useUser();    const [userID, setUserID] = useState(null);
    const [cards, setCards] = useState([]);
    const [outfits, setOutfits] = useState([]);
    const [hasClothes, setHasClothes] = useState(false);

    useEffect(() => {
        if (user != null) {
        setUserID(user.uid);
        }

        //fetches user data
        const c = query(collection(db, `users/${userID}/clothes`));

        //fetch clothes
        const cData = onSnapshot(c, (QuerySnapshot) => {
        let itemsArr: any = [];
        let clothesArr: any = [];

        QuerySnapshot.forEach((doc) => {
            itemsArr.push({ ...doc.data(), id: doc.id });
        });

        for (let i = 0; i < itemsArr.length; i++) {
            let clothing: Clothing | null = new Clothing(
            itemsArr[i].Name,
            itemsArr[i].Color,
            itemsArr[i].Type,
            itemsArr[i].Image,
            itemsArr[i].Style
            );
            clothesArr.push({ clothing, id: itemsArr[i].id });
            clothing = null;
        }

        setCards(clothesArr);

        if (clothesArr.length >= 1) {
            setHasClothes(true);
        }
        });

        //fetch outfits
        const o = query(collection(db, `users/${userID}/outfits`));

        const oData = onSnapshot(o, (QuerySnapshot) => {
        let outfitArr: any = [];

        QuerySnapshot.forEach((doc) => {
            outfitArr.push({ ...doc.data(), id: doc.id });
        });

        setOutfits(outfitArr);

        if (outfitArr.length >= 1) {
            setHasClothes(true);
        }
        });
    }, [user, userID]);

    return (
        <ClosetContext.Provider value={{ cards, outfits, hasClothes }}>
        {children}
        </ClosetContext.Provider>
    );
}

export const useCloset = () => useContext(ClosetContext);
