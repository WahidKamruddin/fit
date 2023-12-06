"use client"

import Clothing from "../class";
import { useState } from "react";
import {HiViewGrid} from "react-icons/hi";
import {IoMdAdd} from "react-icons/io";
import {BiSortAlt2} from "react-icons/bi";
import {TiDelete} from "react-icons/ti";
import Card from "../components/card";

export default function Closet() {
  const [clothingName, setClothingName] = useState('');
  const [clothingColor, setClothingColor] = useState('');
  const [clothingType, setClothingType] = useState('');
  const [clothingStyle, setClothingStyle] = useState('');
  const [output, setOutput] = useState('');

  const [add, setAdd] = useState(false);
  

  const createClothing = () => {
    let aClothing = new Clothing(clothingName,clothingColor,clothingType,undefined,undefined);
    console.log(aClothing);
    console.log(aClothing.getName());
    setOutput("The clothing is a " + aClothing.getName() + " The clothing color is " + aClothing.getColor() + " The clothing type is " + aClothing.getType())
  }


  let aClothing = new Clothing("Sweater","green","top",undefined,undefined);

  let closet = [aClothing];

  return (
    <div className="h-screen pt-20 bg-off-white-100 text-black relative"> 
      <div className="ml-20 mr-20">
        <h1 className="text-4xl">{"Wahid's Closet"}</h1>

        {/* Header */}
        <div className="mt-5 w-full flex justify-between">
          <ul className="w-2/6 mt-4 text-xl font-light justify-self-start flex justify-between hover:cursor-pointer">
            <li>All</li>
            <li>Outerwear</li>
            <li>Tops</li>
            <li>Bottoms</li>
          </ul>
          <div className="w-3/6 flex justify-center">
            <div className="mx-8 mt-2 bg-mocha-150 text-white py-2 px-4 rounded-lg flex">Sort by <BiSortAlt2 className="text-xl text-white"/> </div>
            <div className="mx-8 p-2 mt-2 bg-mocha-150 rounded-3xl"><HiViewGrid  className="text-2xl text-white"/></div>
            <button onClick={()=>{setAdd(true)}} className="mx-8 p-2 mt-2 bg-mocha-150 rounded-3xl"><IoMdAdd className="text-2xl text-white"/></button>
          </div>
        </div> 

        {/* Clothing cards */}
        <div className="mt-14 w-full flex justify-evenly">
          {Card(aClothing)}
          {Card(aClothing)}
          {Card(aClothing)}
        </div>
        <div className="mt-10 w-full flex justify-evenly">
          {Card(aClothing)}
          {Card(aClothing)}
        </div>
      </div>

      {/* add button */}
      {add? <div className="absolute w-full h-full top-0 bg-black z-50 flex justify-center items-center bg-opacity-20">
        <div className="relative w-1/4 h-auto p-3 bg-white opacity-100 rounded-xl flex flex-col justify-center">
          <h1 className="text-center">Add a clothing</h1>

          <form>
            <label> Name:</label>
            <input type="text" onChange={(e) => setClothingName(e.target.value)}/>

            <br></br>

            <label> Color:</label>
            <input type="text" onChange={(e) => setClothingColor(e.target.value)}/>

            <br></br>

            <label> Type:</label>
            <select onChange={(e) => setClothingType(e.target.value)}>
              <option></option>
              <option>Outerwear</option>
              <option>Top</option>
              <option>Bottom</option>
            </select>
            
            <br></br>
          </form>
          <button onClick={(e) => createClothing()} className="w-fit mt-6 p-2 px-3 bg-mocha-300 self-center rounded-lg text-white hover:text-mocha-500 duration-300">Fold away</button>

          <button onClick={()=>{setAdd(false)}} className="absolute top-0 right-0"><TiDelete className="text-3xl text-rose-600"/></button>
        </div>
      </div> : ''}
    </div>
  )
}
 