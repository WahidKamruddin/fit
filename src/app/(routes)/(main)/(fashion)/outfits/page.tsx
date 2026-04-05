"use client";

import Clothing from "@/src/app/classes/clothes";
import { useMemo, useState } from "react";
import { HiViewGrid } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import { BiSortAlt2 } from "react-icons/bi";
import { TiDelete } from "react-icons/ti";
import { db } from "@/src/app/firebaseConfig/clientApp";
import { addDoc, collection } from "firebase/firestore";
import CardList from "@/src/app/components/card-list";
import { useUser } from "@/src/app/auth/auth";
import NotLoggedIn from "@/src/app/components/not-logged-in";
import OutfitCard from "@/src/app/components/outfit-card";
import { useCloset } from "@/src/app/providers/closetContext";
import { Pencil } from "lucide-react";


export default function Outfit() {
  const user = useUser();

  const [outerWear, setOuterWear] = useState<[Clothing, string] | null>(null);
  const [top, setTop] = useState<[Clothing, string] | null>(null);
  const [bottom, setBottom] = useState<[Clothing, string] | null>(null);

  const { cards, hasClothes, outfits } = useCloset();

  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);

  const handleSelect = (item: Clothing, id: string) => {
    const type = item.getType();
    if (type === "Outerwear") setOuterWear([item, id]);
    else if (type === "Top") setTop([item, id]);
    else if (type === "Bottom") setBottom([item, id]);
  };

  const addOutfit = async () => {
    if (!user || !outerWear || !top || !bottom) return;
    await addDoc(collection(db, `users/${user.uid}/outfits`), {
      OuterWear: outerWear[1],
      Top: top[1],
      Bottom: bottom[1],
      Date: null,
    });
  };

  const createOutfit = () => {
    if (outerWear && top && bottom) {
      addOutfit();
      exit();
    }
  };

  const exit = () => {
    setAdd(false);
    setOuterWear(null);
    setTop(null);
    setBottom(null);
  };

  const memoizedOutfits = useMemo(() => {
    return outfits?.map((something) => (
      <div key={something.id}>
        <div className="px-16">
          <OutfitCard userID={user?.uid ?? null} outfit={something} clothes={cards} canEdit={edit} />
        </div>
      </div>
    ));
  }, [outfits, cards, edit]);

  if (!user) return <NotLoggedIn />;

  return (
    <div className="h-screen pt-16 bg-off-white-100 text-black relative">
      <div className="mx-20">
        <h1 className="text-4xl">
          {user.displayName?.split(" ")[0]}'s Outfits
        </h1>

        {/* Header */}
        <div className="mt-5 w-full flex justify-between">
          <ul className="w-2/6 mt-4 text-xl font-light justify-self-start flex justify-between"></ul>
          <div className="w-3/6 flex justify-center">
            <div className="mx-8 mt-2 bg-mocha-150 text-white py-2 px-4 rounded-lg flex cursor-not-allowed">
              Sort by <BiSortAlt2 className="text-xl text-white" />{" "}
            </div>
            <div className="mx-8 p-2 mt-2 bg-mocha-150 rounded-3xl cursor-not-allowed">
              <HiViewGrid className="text-2xl text-white" />
            </div>
            <button onClick={() => { setAdd(true); }} className="mx-8 p-2 mt-2 bg-mocha-150 rounded-3xl">
              <IoMdAdd className="text-2xl text-white" />
            </button>
            <button onClick={() => { setEdit(!edit); }} className="mx-8 p-2 mt-2 bg-mocha-150 rounded-3xl">
              <Pencil className="text-white"/>
            </button>
          </div>
        </div>

        {/* Outfit cards */}
        <div className="absolute mt-10 mr-8 h-4/6 flex justify-center">
          <div className="w-7/8 h-full flex flex-wrap justify-center overflow-y-scroll ">
            {memoizedOutfits}
          </div>
        </div>
      </div>

      {/* Add outfit modal */}
      {add && (
        <div className="absolute w-full h-full top-0 bg-black z-50 flex justify-center items-center bg-opacity-20">
          <div className="relative w-10/12 h-auto p-3 bg-white opacity-100 rounded-xl flex flex-col justify-center">
            <h1 className="text-center">Add an Outfit</h1>
            <div className="m-12 flex justify-between">
              <div className="w-64 h-64 bg-transparent border-2 border-gray-300 border-dashed flex justify-center items-center">
                {outerWear ? (
                  <img
                    alt="outerwear"
                    src={outerWear[0].getImageUrl()}
                    className="p-4 min-w-48 h-48 group-hover:blur-sm z-0"
                  />
                ) : (
                  <p>Outerwear</p>
                )}
              </div>
              <div className="w-64 h-64 bg-transparent border-2 border-gray-300 border-dashed flex justify-center items-center">
                {top ? (
                  <img
                    alt="top"
                    src={top[0].getImageUrl()}
                    className="p-4 min-w-48 h-48 group-hover:blur-sm z-0"
                  />
                ) : (
                  <p>Top</p>
                )}
              </div>
              <div className="w-64 h-64 bg-transparent border-2 border-gray-300 border-dashed flex justify-center items-center">
                {bottom ? (
                  <img
                    alt="bottom"
                    src={bottom[0].getImageUrl()}
                    className="p-4 min-w-48 h-48 group-hover:blur-sm z-0"
                  />
                ) : (
                  <p>Bottom</p>
                )}
              </div>
            </div>

            <div className="w-full flex justify-center items-center">
              <button
                onClick={createOutfit}
                disabled={!outerWear || !top || !bottom}
                className="bg-blue-100 disabled:cursor-not-allowed cursor-pointer"
              >
                Make Outfit
              </button>
            </div>

            <div className="w-full h-48">
              <CardList
                userID={user.uid}
                cards={cards}
                hasClothes={hasClothes}
                edit={false}
                select={true}
                handleOuterWear={handleSelect}
              />
            </div>

            <button onClick={exit} className="absolute top-0 right-0">
              <TiDelete className="text-3xl text-rose-600" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
