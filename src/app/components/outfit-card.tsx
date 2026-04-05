import { useEffect, useState } from "react";
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/clientApp";
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
  deleteDate?: boolean;
}

const OutfitCard = ({ userID, outfit, clothes, canEdit, deleteDate }: OutfitCardProps) => {
  const { OuterWear, Top, Bottom } = outfit;

  const [oWImg, setoWImg] = useState<string | undefined>();
  const [topImg, setTopImg] = useState<string | undefined>();
  const [botImg, setBotImg] = useState<string | undefined>();

  const deleteOutfit = async () => {
    if (!userID) return;
    await deleteDoc(doc(db, `users/${userID}/outfits`, outfit.id));
  };

  const clearDate = async () => {
    if (!userID) return;
    await updateDoc(doc(db, `users/${userID}/outfits`, outfit.id), {
      Date: null,
    });
  };

  useEffect(() => {
    for (const card of clothes) {
      if (card.id === OuterWear) setoWImg(card.clothing.getImageUrl());
      if (card.id === Top) setTopImg(card.clothing.getImageUrl());
      if (card.id === Bottom) setBotImg(card.clothing.getImageUrl());
    }
  }, [clothes, OuterWear, Top, Bottom]);

  return (
    <div className="my-12 relative flex justify-center">
      {canEdit && (
        <button className="absolute top-0 right-0 p-2 bg-red-600 rounded-xl" onClick={deleteOutfit} />
      )}
      {deleteDate && (
        <button className="absolute top-0 right-0 p-2 bg-red-600 rounded-xl" onClick={clearDate} />
      )}
      {oWImg && <div><img src={oWImg} alt="outerwear" className="pt-4 min-w-48 h-48" /></div>}
      {topImg && <div className="absolute top-10"><img src={topImg} alt="top" className="pt-4 min-w-48 h-48" /></div>}
      {botImg && <div className="absolute top-20"><img src={botImg} alt="bottom" className="pt-4 min-w-48 h-48" /></div>}
    </div>
  );
};

export default OutfitCard;
