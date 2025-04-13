"use client";

import Clothing from "@/src/app/classes/clothes";
import { useEffect, useMemo, useState } from "react";
import { HiViewGrid } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import { BiSortAlt2 } from "react-icons/bi";
import { TiDelete } from "react-icons/ti";
import { db, storage } from "@/src/app/firebaseConfig/clientApp";
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import CardList from "@/src/app/components/cardList";
import { useUser } from "@/src/app/auth/auth";
import notLoggedIn from "@/src/app/components/notLoggedIn";
import OutfitCard from "@/src/app/components/outfitCard";
import { useCloset } from "@/src/app/providers/closetContext";
import { Pencil } from "lucide-react";


export default function Outfit() {
  //Define User
  const user = useUser();
  const [userID, setUserID] = useState(null);

  //Clothing states
  const [outerWear, setOuterWear] = useState<any | null>(null);
  const [top, setTop] = useState<any | null>(null);
  const [bottom, setBottom] = useState<any | null>(null);

  //fetch data states
  const { cards, hasClothes, outfits } = useCloset();

  //add
  const [add, setAdd] = useState(false);

  //edit
  const [edit, setEdit] = useState(false);

  useEffect(() => {
    if (user != null) {
      setUserID(user.uid);
    }
  }, [user, userID]);

  //add outfit
  const handleOuterWear = (item: Clothing, id: any) => {
    let type = item.getType();
    if (type == "Outerwear") {
      setOuterWear([item, id]);
    } else if (type == "Top") {
      setTop([item, id]);
    } else if (type == "Bottom") {
      setBottom([item, id]);
    }
    console.log(outerWear, top, bottom);
  };

  //add outfit
  const addOutfit = async (outerWear: any, top: any, bottom: any) => {
    await addDoc(collection(db, `users/${userID}/outfits`), {
      OuterWear: outerWear,
      Top: top,
      Bottom: bottom,
      Date: null,
    });
  };

  //create outfit
  const createOutfit = () => {
    if (outerWear && top && bottom) {
      addOutfit(outerWear[1], top[1], bottom[1]);
      exit();
    }
  };

  //exit from add
  const exit = () => {
    setAdd(false);
    setOuterWear(null);
    setTop(null);
    setBottom(null);
  };

  const memoizedOutfits = useMemo(() => {
    return outfits?.map((something: any) => (
      <div key={something.id}>
        <div className="px-16">
          <OutfitCard userID={userID} outfit={something} clothes={cards} canEdit={edit} />
        </div>
      </div>
    ));
  }, [outfits, cards, edit, add]);

  return (
    <div>
      {user ? (
        <div className="h-screen pt-16 bg-off-white-100 text-black relative">
          <div className="mx-20">
            <h1 className="text-4xl">
              {user.displayName.split(" ")[0]}'s Outfits
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
                <button onClick={() => {setAdd(true);}} className="mx-8 p-2 mt-2 bg-mocha-150 rounded-3xl">
                  <IoMdAdd className="text-2xl text-white" />
                </button>
                <button onClick={() => {setEdit(!edit);}} className="mx-8 p-2 mt-2 bg-mocha-150 rounded-3xl">
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

          {/* add button, turn into a component! */}
          {add ? (
            <div className="absolute w-full h-full top-0 bg-black z-50 flex justify-center items-center bg-opacity-20">
              <div className="relative w-10/12 h-auto p-3 bg-white opacity-100 rounded-xl flex flex-col justify-center">
                <h1 className="text-center">Add an Outfit</h1>
                <div className="m-12 flex justify-between">
                  <div className="w-64 h-64 bg-transparent border-2 border-gray-300 border-dashed flex justify-center items-center">
                    {outerWear ? (
                      <img
                        alt="clothing"
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
                        alt="clothing"
                        src={top[0].getImageUrl()}
                        className="p-4 min-w-48 h-48 group-hover:blur-sm z-0"
                      />
                    ) : (
                      <p>top</p>
                    )}
                  </div>
                  <div className="w-64 h-64 bg-transparent border-2 border-gray-300 border-dashed flex justify-center items-center">
                    {bottom ? (
                      <img
                        alt="clothing"
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
                    className={`${
                      outerWear && top && bottom && "cursor-pointer"
                    } bg-blue-100  cursor-not-allowed`}
                  >
                    Make Outfit
                  </button>
                </div>

                <div className="w-full h-48">
                  <CardList
                    userID={userID}
                    cards={cards}
                    hasClothes={hasClothes}
                    edit={false}
                    select={true}
                    handleOuterWear={handleOuterWear}
                  />
                </div>

                {/* Close add component */}
                <button onClick={exit} className="absolute top-0 right-0">
                  <TiDelete className="text-3xl text-rose-600" />
                </button>
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
      ) : (
        notLoggedIn()
      )}
    </div>
  );
}
