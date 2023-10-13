"use client"

import Clothing from "../class";
import { useState } from "react";

export default function Home() {
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
    <div> 
      <form>
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
      <button onClick={(e) => createClothing()}>Create Clothing</button>

      <p>{output}</p>

    </div>
  )
}
