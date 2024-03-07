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

export default function Closet() {
  //Define User
  const user = useUser();
  const [userID, setUserID] = useState(null);


  //Header states
  const [all, setAll] = useState(true);
  const [outerWear, setOuterWear] = useState(false);
  const [tops, setTops] = useState(false);
  const [bottoms, setBottoms] = useState(false);


  //Clothing states
  const [clothingName, setClothingName] = useState('');
  const [clothingColor, setClothingColor] = useState('');
  const [clothingType, setClothingType] = useState('');


  //fetch data states
  const [hasClothes, setHasClothes] = useState(false);
  const [cards, setCards] = useState([]);

  //add data
  const [add, setAdd] = useState(false);
  const [file, setFile] = useState<any | null>(null);
  const [img, setImg] = useState<any | null>(null);

  const fileTypes = ["JPG", "JPEG", "PNG", "GIF"];

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

  }, [user,userID,img]);


  //add clothing

  //creates instance of a clothing class
  const createClothing = (e:any) => {
    setAdd(false);
    let someClothing = new Clothing(clothingName,clothingColor,clothingType);
    console.log(file);
    addItem(someClothing);
  };
  
  const addClothing = async (someClothing:any, img:any, imageID:any) => {
    await addDoc(collection(db, `users/${userID}/clothes`), {
      Color: someClothing.getColor(),
      Material: someClothing.getMaterial(),
      Name: someClothing.getName(),
      Style: someClothing.getStyle(),
      Type: someClothing.getType(),
      Image: img,
      ImageID : imageID
    });
  }

  

  //adds clothing instance to firestore
  const addItem = async (someClothing:Clothing) => {
    const imageID = v4();
    const imageRef = ref(storage, `${userID}/${imageID}`)

    await uploadBytes(imageRef, file).then(data=> {
      console.log(data,imageRef);
      getDownloadURL(data.ref).then(async val => { 
        await addClothing(someClothing, val, imageID)
      })
    });
        
    
    
  };


  //Filter Clothes
  const filterAll = () => {
    setAll(true);
    setOuterWear(false);
    setTops(false);
    setBottoms(false);
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




  return (
    <div>
      {user?
      <div className="h-screen pt-16  bg-off-white-100 text-black"> 
        <h1 className="text-4xl mx-20">{user.displayName.split(' ')[0]}'s Closet</h1>

        {/* Header */}
        <div className="mt-5 mx-20 w-full flex justify-between">
          <ul className="w-2/6 mt-4 text-xl font-light justify-self-start flex justify-between">
            <li className="pb-1 border-b-2 border-transparent hover:border-black hover:duration-700"><button onClick={filterAll}>All</button></li>
            <li className="pb-1 border-b-2 border-transparent hover:border-black hover:duration-700"><button onClick={filterOuterWear}>Outerwear</button></li>
            <li className="pb-1 border-b-2 border-transparent hover:border-black hover:duration-700"><button onClick={filterTops}>Tops</button></li>
            <li className="pb-1 border-b-2 border-transparent hover:border-black hover:duration-700"><button onClick={filterBottoms}>Bottoms</button></li>
          </ul>
          <div className="w-3/6 flex justify-center">
            <div className="mx-8 mt-2 bg-mocha-150 text-white py-2 px-4 rounded-lg flex cursor-not-allowed">Sort by <BiSortAlt2 className="text-xl text-white"/> </div>
            <div className="mx-8 p-2 mt-2 bg-mocha-150 rounded-3xl cursor-not-allowed"><HiViewGrid  className="text-2xl text-white"/></div>
            <button onClick={()=>{setAdd(true)}} className="mx-8 p-2 mt-2 bg-mocha-150 rounded-3xl"><IoMdAdd className="text-2xl text-white"/></button>
          </div>
        </div> 

        {/* Clothing cards */}
        <div className="mt-10 mx-20 h-4/6 flex justify-center">
          {all? <CardList userID={userID} cards={cards} hasClothes={hasClothes} edit={true} select={false}/> 
          : outerWear? <CardList userID={userID} cards={cards.filter((card:any) => card.clothing.type === 'Outerwear')} hasClothes={hasClothes} edit={true} select={false}/> 
          : tops? <CardList userID={userID} cards={cards.filter((card:any) => card.clothing.type === 'Top')} hasClothes={hasClothes} edit={true} select={false}/> 
          : bottoms? <CardList userID={userID} cards={cards.filter((card:any) => card.clothing.type === 'Bottom')} hasClothes={hasClothes} edit={true} select={false}/> : null}
        </div> 

        {/* add button, turn into a component! */}
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

              <FileUploader 
                multiple={false} 
                handleChange={(e:any) => setFile(e)} 
                types={fileTypes} 
                name="file"
                label="Upload or Drop a File"
                required
                />

              <br></br>
              <button className="w-fit mt-6 p-2 px-3 bg-mocha-300 rounded-lg text-white hover:text-mocha-500 duration-300">Fold away</button>
            </form>

            {/* or */}
            <div className="my-4 flex items-center">
                    <div className="border-t border-gray-300 flex-grow mr-3"></div>
                    <span className="text-gray-500">or</span>
                    <div className="border-t border-gray-300 flex-grow ml-3"></div>
            </div>

            <div className="text-gray-500 text-center">Upload from your favorite store:</div>

            
            {/* upload from your favorite store */}
            <button className="mt-4 py-2 bg-red-700 text-white text-center rounded-lg "> Uniqlo </button> 


            {/* X button */}
            <button onClick={()=>{setAdd(false)}} className="absolute top-0 right-0"><TiDelete className="text-3xl text-rose-600"/></button>
          </div>
        </div> : ''}
      </div> :      
        notLoggedIn()
      }
    </div>
  )
}
 