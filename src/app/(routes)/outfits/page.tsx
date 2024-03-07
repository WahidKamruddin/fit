'use client'

import Clothing from "../../classes/clothes";
import { useEffect, useState } from "react";
import {HiViewGrid} from "react-icons/hi";
import {IoMdAdd} from "react-icons/io";
import {BiSortAlt2} from "react-icons/bi";
import {TiDelete} from "react-icons/ti";
import { db, storage } from "../../firebaseConfig/clientApp";
import { addDoc, collection, onSnapshot, query } from "firebase/firestore";
import CardList from "../../components/cardList";
import { FileUploader } from "react-drag-drop-files";
import { useUser } from "../../auth/auth";
import notLoggedIn from "../../components/notLoggedIn";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import Card from "../../components/card";

export default function Outfit() {
  //Define User
  const user = useUser();
  const [userID, setUserID] = useState(null);


  //Header states
  const [outerWear, setOuterWear] = useState(null);
  const [top, setTop] = useState(null);
  const [bottom, setBottom] = useState(null);



  //fetch data states
  const [hasClothes, setHasClothes] = useState(false);
  const [cards, setCards] = useState([]);

  //add data
  const [add, setAdd] = useState(false);


  useEffect(() => {
    if (user != null) {
      setUserID(user.uid);
    }

    //fetches user data
    const q = query(collection(db, `users/${userID}/clothes`));
    const data = onSnapshot(q, (QuerySnapshot) => {
      let itemsArr :any = [];
      let clothesArr :any = [];

      QuerySnapshot.forEach((doc) => {
        itemsArr.push({...doc.data(), id: doc.id});
      });

      for (let i = 0; i < itemsArr.length; i++) {
        let clothing = new Clothing(itemsArr[i].Name, itemsArr[i].Color, itemsArr[i].Type, itemsArr[i].Image, itemsArr[i].Style);
        clothesArr.push({clothing, id:itemsArr[i].id});
      }

      setCards(clothesArr);

      if (clothesArr.length >= 1) { setHasClothes(true); }
    })

  }, [user,userID]);


  //add clothing
  const handleOuterWear = (img:any, type:any) => {
    if (type == 'Outerwear') { setOuterWear(img); }
    else if (type == 'Top') { setTop(img); }
    else if (type == 'Bottom') { setBottom(img); }
  };

  const exit = () => {
    setAdd(false);
    setOuterWear(null);
    setTop(null);
    setBottom(null);
  }

  return (
    <div>
      {user?
      <div className="h-screen pt-16 bg-off-white-100 text-black relative"> 
        <div className="mx-20">
          <h1 className="text-4xl">{user.displayName.split(' ')[0]}'s Outfits</h1>

          {/* Header */}
          <div className="mt-5 w-full flex justify-between">
            <ul className="w-2/6 mt-4 text-xl font-light justify-self-start flex justify-between">
            </ul>
            <div className="w-3/6 flex justify-center">
              <div className="mx-8 mt-2 bg-mocha-150 text-white py-2 px-4 rounded-lg flex cursor-not-allowed">Sort by <BiSortAlt2 className="text-xl text-white"/> </div>
              <div className="mx-8 p-2 mt-2 bg-mocha-150 rounded-3xl cursor-not-allowed"><HiViewGrid  className="text-2xl text-white"/></div>
              <button onClick={()=>{setAdd(true)}} className="mx-8 p-2 mt-2 bg-mocha-150 rounded-3xl"><IoMdAdd className="text-2xl text-white"/></button>
            </div>
          </div> 

          {/* Clothing cards */}
          <div className="mt-10 w-full flex justify-center">
            <CardList userID={userID} cards={cards} hasClothes={hasClothes} edit={false} select={true} handleOuterWear={handleOuterWear}/> 
          </div> 
        </div>

        {/* add button, turn into a component! */}
        {add? 
        <div className="absolute w-full h-full top-0 bg-black z-50 flex justify-center items-center bg-opacity-20">
          <div className="relative w-10/12 h-auto p-3 bg-white opacity-100 rounded-xl flex flex-col justify-center">
            <h1 className="text-center">Add a clothing</h1>
            <div className="m-12 flex justify-between">
              <div className="w-64 h-64 bg-transparent border-2 border-gray-300 border-dashed flex justify-center items-center">
                {outerWear? <img alt="clothing" src={outerWear} className="p-4 min-w-48 h-48 group-hover:blur-sm z-0"/>:
                <p>Outerwear</p>}
              </div>
              <div className="w-64 h-64 bg-transparent border-2 border-gray-300 border-dashed flex justify-center items-center">
                {top? <img alt="clothing" src={top} className="p-4 min-w-48 h-48 group-hover:blur-sm z-0"/>:
                <p>top</p>}
              </div>
              <div className="w-64 h-64 bg-transparent border-2 border-gray-300 border-dashed flex justify-center items-center">
                {bottom? <img alt="clothing" src={bottom} className="p-4 min-w-48 h-48 group-hover:blur-sm z-0"/>:
                <p>Bottom</p>}
              </div>
            </div>

            <div className="w-full h-48">
              <CardList userID={userID} cards={cards} hasClothes={hasClothes} edit={false} select={true} handleOuterWear={handleOuterWear}/>
            </div>

            {/* Close add component */}
            <button onClick={exit} className="absolute top-0 right-0"><TiDelete className="text-3xl text-rose-600"/></button>
          </div>
        </div> : ''}
      </div> :      
        notLoggedIn()
      }  
    </div>
  )
}
 