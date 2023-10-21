"use client"

import Clothing from "../class";
import { useState } from "react";
import {HiViewGrid} from "react-icons/hi";
import {IoAddOutline} from "react-icons/io5";
import {BiSortAlt2} from "react-icons/bi";

export default function Closet() {
  const [clothingName, setClothingName] = useState('');
  const [clothingColor, setClothingColor] = useState('');
  const [clothingType, setClothingType] = useState('');
  const [clothingStyle, setClothingStyle] = useState('');
  const [output, setOutput] = useState('');
  

  const createClothing = () => {
    let aClothing = new Clothing(clothingName,clothingColor,clothingType,undefined,undefined);
    console.log(aClothing);
    console.log(aClothing.getName());
    setOutput("The clothing is a " + aClothing.getName() + " The clothing color is " + aClothing.getColor() + " The clothing type is " + aClothing.getType())
  }

  return (
    <div className="h-screen pt-20 bg-off-white-100 text-black"> 
      <div className="ml-20">
        <h1 className="text-4xl">Wahid's Closet</h1>
        <div className="mt-10 w-full flex justify-between">
          <ul className="w-2/6 text-xl bg-mocha-400 font-light justify-self-start flex justify-between">
            <li>All</li>
            <li>Outerwear</li>
            <li>Tops</li>
            <li>Bottoms</li>
          </ul>
          <div className="w-3/6 flex justify-center">
            <div className="mx-8 bg-mocha-150 text-white py-2 px-4 rounded-lg flex">Sort by <BiSortAlt2 className="text-xl text-white"/> </div>
            <div className="mx-8 bg-mocha-150 p-2 rounded-3xl"><HiViewGrid  className="text-2xl text-white"/></div>
            <div className="mx-8 bg-mocha-150 text-2xl text-white p-2 rounded-3xl">+</div>
          </div>
        </div>
      </div>

      {/* <form>
        <label> Name:</label>
        <input type="text" onChange={(e) => setClothingName(e.target.value)}/>

        <br></br>

        <label> Color:</label>
        <input type="text" onChange={(e) => setClothingColor(e.target.value)}/>

        <br></br>

        <label> Type:</label>
        <input type="text" onChange={(e) => setClothingType(e.target.value)}/>
        
        <br></br>

        <label> Style:</label>
        <input type="text" onChange={(e) => setClothingStyle(e.target.value)}/>
        <br></br>
      </form>
      <button onClick={(e) => createClothing()}>Create Clothing</button> */}

      <p>{output}</p>

    </div>
  )
}
