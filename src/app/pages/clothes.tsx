"use client"

import Clothing from "../class";
import { useEffect, useState } from "react";
import {HiViewGrid} from "react-icons/hi";
import {IoMdAdd} from "react-icons/io";
import {BiSortAlt2} from "react-icons/bi";
import {TiDelete} from "react-icons/ti";
import Card from "../components/card";
import { Aclonica } from "next/font/google";
import { db } from "../firebase/clientApp";
import { QuerySnapshot, addDoc, collection, deleteDoc, doc, onSnapshot, query } from "firebase/firestore";
import CardList from "../components/cardList";

export default function Closet() {
  //Header properties
  const [all, setAll] = useState(true);
  const [outerWear, setOuterWear] = useState(false);
  const [tops, setTops] = useState(false);
  const [bottoms, setBottoms] = useState(false);

  const filterAll = () => {
    setAll(true);
    setOuterWear(false);
    setTops(false);
    setBottoms(false);

    console.log("filtering all.. clothes array: ");
    console.log(cards);
  }

  const filterOuterWear = () => {
    setAll(false);
    setOuterWear(true);
    setTops(false);
    setBottoms(false);

    console.log("filtering outerwear.. clothes array: " + cards);
  }

  const filterTops = () => {
    setAll(false);
    setOuterWear(false);
    setTops(true);
    setBottoms(false);

    console.log("filtering tops.. clothes array: " + cards);

  }

  const filterBottoms = () => {
    setAll(false);
    setOuterWear(false);
    setTops(false);
    setBottoms(true);

    console.log("filtering bottoms.. clothes array: " + cards);

  }

  //Clothing Properties
  const [clothingName, setClothingName] = useState('');
  const [clothingColor, setClothingColor] = useState('');
  const [clothingType, setClothingType] = useState('');


  //fetch data
  const [hasClothes, setHasClothes] = useState(false);
  const [cards, setCards] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'Clothes'));
    const data = onSnapshot(q, (QuerySnapshot) => {
      let itemsArr :any = [];
      let clothesArr :any = [];

      QuerySnapshot.forEach((doc) => {
        itemsArr.push({...doc.data(), id: doc.id});
      });

      for (let i = 0; i < itemsArr.length; i++) {
        let clothing = new Clothing(itemsArr[i].Name, itemsArr[i].Color, itemsArr[i].Type, itemsArr[i].Style);
        clothesArr.push({clothing, id:itemsArr[i].id});
      }

      setCards(clothesArr);

      if (clothesArr.length >= 1) { setHasClothes(true); }
    })
  }, []);


  //add clothing
  const [add, setAdd] = useState(false);
  const [image, setImage] = useState('');

  const createClothing = (e:any) => {
    e.preventDefault();
    setAdd(false);
    let someClothing = new Clothing(clothingName,clothingColor,clothingType);
    addItem(someClothing);
  };

  const addItem = async (someClothing:Clothing) => {
    await addDoc(collection(db, 'Clothes'), {
      Color: someClothing.getColor(),
      Material: someClothing.getMaterial(),
      Name: someClothing.getName(),
      Style: someClothing.getStyle(),
      Type: someClothing.getType(),
    });
  };





  return (
    <div className="h-screen pt-16 bg-off-white-100 text-black relative"> 
      <div className="mx-20">
        <h1 className="text-4xl">{"Wahid's Closet"}</h1>

        {/* Header */}
        <div className="mt-5 w-full flex justify-between">
          <ul className="w-2/6 mt-4 text-xl font-light justify-self-start flex justify-between">
            <li><button onClick={filterAll }>All</button></li>
            <li><button onClick={filterOuterWear}>Outerwear</button></li>
            <li><button onClick={filterTops}>Tops</button></li>
            <li><button onClick={filterBottoms}>Bottoms</button></li>
          </ul>
          <div className="w-3/6 flex justify-center">
            <div className="mx-8 mt-2 bg-mocha-150 text-white py-2 px-4 rounded-lg flex">Sort by <BiSortAlt2 className="text-xl text-white"/> </div>
            <div className="mx-8 p-2 mt-2 bg-mocha-150 rounded-3xl"><HiViewGrid  className="text-2xl text-white"/></div>
            <button onClick={()=>{setAdd(true)}} className="mx-8 p-2 mt-2 bg-mocha-150 rounded-3xl"><IoMdAdd className="text-2xl text-white"/></button>
          </div>
        </div> 

        {/* Clothing cards */}
        <div className="mt-10 w-full flex justify-center">
          {all? <CardList cards={cards} hasClothes={hasClothes}/> 
          : outerWear? <CardList cards={cards.filter((card:any) => card.clothing.type === 'Outerwear')} hasClothes={hasClothes}/> 
          : tops? <CardList cards={cards.filter((card:any) => card.clothing.type === 'Top')} hasClothes={hasClothes}/> 
          : bottoms? <CardList cards={cards.filter((card:any) => card.clothing.type === 'Bottom')} hasClothes={hasClothes}/> : <div></div>}
        </div>
      </div>

      {/* add button */}
      {add? <div className="absolute w-full h-full top-0 bg-black z-50 flex justify-center items-center bg-opacity-20">
        <div className="relative w-1/4 h-auto p-3 bg-white opacity-100 rounded-xl flex flex-col justify-center">
          <h1 className="text-center">Add a clothing</h1>

          <form onSubmit={createClothing}>
            <label>Name:</label>
            <input type="text" required onChange={(e) => setClothingName(e.target.value)}/>

            <br></br>

            <label>Color:</label>
            <input type="text" required onChange={(e) => setClothingColor(e.target.value)}/>

            <br></br>

            <label>Type:</label>
            <select required onChange={(e) => setClothingType(e.target.value)}>
              <option></option>
              <option>Outerwear</option>
              <option>Top</option>
              <option>Bottom</option>
            </select>
            
            <br></br>

            <button className="w-fit mt-6 p-2 px-3 bg-mocha-300 rounded-lg text-white hover:text-mocha-500 duration-300">Fold away</button>
          </form>

          <button onClick={()=>{setAdd(false)}} className="absolute top-0 right-0"><TiDelete className="text-3xl text-rose-600"/></button>
        </div>
      </div> : ''}
    </div>
  )
}
 