import { FaMinusCircle, FaStar } from "react-icons/fa";
import { AiOutlineStar } from "react-icons/ai";
import { useState } from "react";
import { supabase } from "../supabaseConfig/client";
import Clothing from "../classes/clothes";

interface CardProps {
  userID: string;
  aClothing: { clothing: Clothing; id: string };
  edit: boolean;
  select: boolean;
  handleOuterWear?: (item: Clothing, id: string) => void;
}

const Card = ({ userID, aClothing, edit, select, handleOuterWear }: CardProps) => {
  const [starred, setStarred] = useState(aClothing.clothing.starred);

  const toggleFavorite = async () => {
    const newStarred = !starred;
    setStarred(newStarred);
    await supabase.from('clothes').update({ starred: newStarred }).eq('id', aClothing.id);
  };

  const deleteClothing = async () => {
    await supabase.from('clothes').delete().eq('id', aClothing.id);
  };

  return (
    <div className="relative w-48 h-48 rounded-xl group">
      <div className="relative bg-gray-100 border-2 rounded-xl select-none">
        {/* delete */}
        {edit && (
          <button
            className="absolute top-0 right-0 m-1 text-center text-md text-red-600 bg-white rounded-xl drop-shadow-xl z-10"
            onClick={deleteClothing}
          >
            <FaMinusCircle />
          </button>
        )}

        {/* favorite */}
        <button
          className="absolute top-2 left-2 text-xl text-yellow-500 cursor-pointer z-10"
          onClick={toggleFavorite}
        >
          {starred ? <FaStar className="text-amber-500" /> : <AiOutlineStar />}
        </button>

        {/* image */}
        <img alt="clothing" src={aClothing.clothing.getImageUrl()} className="p-4 min-w-48 h-48 group-hover:blur-sm z-0" />
      </div>

      {/* text hover */}
      {select ? (
        <button
          onClick={() => handleOuterWear?.(aClothing.clothing, aClothing.id)}
          className="absolute top-0 w-full h-full bg-transparent text-transparent group-hover:text-white flex justify-center items-center"
        >
          <div className="h-fit">
            <h1 className="relative">{aClothing.clothing.getName()}</h1>
          </div>
        </button>
      ) : (
        <div className="absolute top-0 w-full h-full bg-transparent text-transparent group-hover:text-white flex justify-center items-center">
          <div className="h-fit">
            <h1 className="relative">{aClothing.clothing.getName()}</h1>
          </div>
        </div>
      )}
    </div>
  );
};

export default Card;
