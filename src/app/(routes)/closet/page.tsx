'use client'

import Clothing from "../../classes/clothes";
import { useEffect, useState } from "react";
import { HiViewGrid } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import { BiSortAlt2 } from "react-icons/bi";
import { TiDelete } from "react-icons/ti";
import { db, storage } from "../../firebaseConfig/clientApp";
import { addDoc, collection, doc, onSnapshot, query } from "firebase/firestore";
import CardList from "../../components/cardList";
import { FileUploader } from "react-drag-drop-files";
import { useUser } from "../../auth/auth";
import notLoggedIn from "../../components/notLoggedIn";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";

export default function Closet() {
  // Define User
  const user = useUser();
  const [userID, setUserID] = useState(null);

  // Header states
  const [all, setAll] = useState(true);
  const [outerWear, setOuterWear] = useState(false);
  const [tops, setTops] = useState(false);
  const [bottoms, setBottoms] = useState(false);

  // Clothing states
  const [clothingName, setClothingName] = useState('');
  const [clothingColor, setClothingColor] = useState('');
  const [clothingType, setClothingType] = useState('');

  // Fetch data states
  const [hasClothes, setHasClothes] = useState(false);
  const [cards, setCards] = useState([]);

  // Add data states
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [file, setFile] = useState<any | null>(null);
  const [img, setImg] = useState<any | null>(null);

  const fileTypes = ["JPG", "JPEG", "PNG", "GIF"];

  useEffect(() => {
    // Set user ID if user is logged in
    if (user != null) {
      setUserID(user.uid);
    }

    // Fetch user data from Firestore
    const q = query(collection(db, `users/${userID}/clothes`));
    const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
      let itemsArr: any = [];
      let clothesArr: any = [];

      // Populate items array with fetched data
      QuerySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });

      // Create Clothing objects from fetched data
      for (let i = 0; i < itemsArr.length; i++) {
        let clothing = new Clothing(itemsArr[i].Name, itemsArr[i].Color, itemsArr[i].Type, itemsArr[i].Image, itemsArr[i].Style);
        clothesArr.push({ clothing, id: itemsArr[i].id });
      }

      setCards(clothesArr);

      // Update hasClothes state based on fetched data
      if (clothesArr.length >= 1) {
        setHasClothes(true);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();

  }, [user, userID, img]);

  // Function to handle background removal
  const handleBackgroundRemoval = async () => {
    if (!file) return null; // Return null if no file is selected

    const formData = new FormData();
    formData.append("file", file); // Append file to form data

    try {
      // Send file to backend for background removal
      const response = await fetch("http://127.0.0.1:5000/remove-background", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob(); // Get the response as a Blob

        // Create a File object from the Blob
        const fileName = "processed-image.png"; // Set a default file name
        const processedImageFile = new File([blob], fileName, { type: "image/png" });

        const imgURL = URL.createObjectURL(blob);
        setImg(imgURL); // Set image URL for display

        return processedImageFile; // Return the processed image file
      } else {
        // Handle error response
        throw new Error("Failed to remove background");
      }
    } catch (error) {
      // Log any errors that occur
      console.error("Error:", error);
    }
    return null; // Return null if there's an error
  };

  // Function to create a new clothing entry
  const createClothing = async (e: any) => {
    e.preventDefault(); // Prevent default form submission
    setAdd(false); // Close the add clothing modal

    const processedFile = await handleBackgroundRemoval(); // Get the processed image file

    if (processedFile) {
      let someClothing = new Clothing(clothingName, clothingColor, clothingType);
      await addItem(someClothing, processedFile); // Pass the processed image for uploading
    }
  };

  // Function to upload clothing item to Firestore
  const addItem = async (someClothing: Clothing, processedFile: any) => {
    const imageID = v4(); // Generate a unique ID for the image
    const imageRef = ref(storage, `${userID}/${imageID}`); // Create a reference in Firebase storage

    // Upload the processed image file
    await uploadBytes(imageRef, processedFile).then(data => {
      // Get the download URL for the uploaded image
      getDownloadURL(data.ref).then(async val => {
        await addClothing(someClothing, val, imageID); // Add clothing to Firestore with image URL
      });
    });
  };

  // Function to add clothing information to Firestore
  const addClothing = async (someClothing: any, img: any, imageID: any) => {
    await addDoc(collection(db, `users/${userID}/clothes`), {
      Color: someClothing.getColor(),
      Material: someClothing.getMaterial(),
      Name: someClothing.getName(),
      Style: someClothing.getStyle(),
      Type: someClothing.getType(),
      Image: img,
      ImageID: imageID
    });
  };

  // Functions to filter clothes based on type
  const filterAll = () => {
    setAll(true);
    setOuterWear(false);
    setTops(false);
    setBottoms(false);
  };

  const filterOuterWear = () => {
    setAll(false);
    setOuterWear(true);
    setTops(false);
    setBottoms(false);
  };

  const filterTops = () => {
    setAll(false);
    setOuterWear(false);
    setTops(true);
    setBottoms(false);
  };

  const filterBottoms = () => {
    setAll(false);
    setOuterWear(false);
    setTops(false);
    setBottoms(true);
  };

  return (
    <>
      {user ?
        <div className="h-screen bg-off-white-100 text-black">
          <h1 className="text-4xl mx-20">{user.displayName.split(' ')[0]}'s Closet</h1>

          {/* Header */}
          <div className="mt-5 mx-20 flex justify-between">
            <ul className="w-2/6 mt-4 text-xl font-light justify-self-start flex justify-between">
              <li className="pb-1 border-b-2 border-transparent hover:border-black hover:duration-700"><button onClick={filterAll}>All</button></li>
              <li className="pb-1 border-b-2 border-transparent hover:border-black hover:duration-700"><button onClick={filterOuterWear}>Outerwear</button></li>
              <li className="pb-1 border-b-2 border-transparent hover:border-black hover:duration-700"><button onClick={filterTops}>Tops</button></li>
              <li className="pb-1 border-b-2 border-transparent hover:border-black hover:duration-700"><button onClick={filterBottoms}>Bottoms</button></li>
            </ul>
            <div className="w-3/6 flex justify-center">
              <div className="mx-8 mt-2 bg-mocha-150 text-white py-2 px-4 rounded-lg flex cursor-not-allowed">Sort by <BiSortAlt2 className="text-xl text-white" /> </div>
              <div className="mx-8 p-2 mt-2 bg-mocha-150 rounded-3xl cursor-not-allowed"><HiViewGrid className="text-2xl text-white" /></div>
              <button onClick={() => { setAdd(true) }} className="mx-8 p-2 mt-2 bg-mocha-150 rounded-3xl"><IoMdAdd className="text-2xl text-white" /></button>
              <button onClick={() => { setEdit(!edit) }} className="mx-8 p-2 mt-2 bg-mocha-150 rounded-3xl"><IoMdAdd className="text-2xl text-white" /></button>
            </div>
          </div>

          {/* Clothing cards */}
          <div className="mt-10 mx-20 h-4/6 flex justify-center">
            {all ? <CardList userID={userID} cards={cards} hasClothes={hasClothes} edit={edit} select={false} />
              : outerWear ? <CardList userID={userID} cards={cards.filter((card: any) => card.clothing.type === 'Outerwear')} hasClothes={hasClothes} edit={edit} select={false} />
                : tops ? <CardList userID={userID} cards={cards.filter((card: any) => card.clothing.type === 'Top')} hasClothes={hasClothes} edit={edit} select={false} />
                  : bottoms ? <CardList userID={userID} cards={cards.filter((card: any) => card.clothing.type === 'Bottom')} hasClothes={hasClothes} edit={edit} select={false} /> : null}
          </div>

          {/* Add clothing modal */}
          {add ? <div className="absolute w-full h-full top-0 bg-black z-50 flex justify-center items-center bg-opacity-20">
            <div className="relative w-1/4 h-auto p-3 bg-white opacity-100 rounded-xl flex flex-col justify-center">
              <h1 className="text-center">Add a clothing</h1>

              <form onSubmit={createClothing}>
                <label>Name:</label>
                <input type="text" required onChange={(e) => setClothingName(e.target.value)} />

                <br />

                <label>Color:</label>
                <input type="text" required onChange={(e) => setClothingColor(e.target.value)} />

                <br />

                <label>Type:</label>
                <select required onChange={(e) => setClothingType(e.target.value)}>
                  <option></option>
                  <option>Outerwear</option>
                  <option>Top</option>
                  <option>Bottom</option>
                </select>

                <br />

                <FileUploader
                  multiple={false}
                  handleChange={(e: any) => setFile(e)}
                  types={fileTypes}
                  name="file"
                  label="Upload or Drop a File"
                  required
                />

                <br />
                <button className="w-fit mt-6 p-2 px-3 bg-mocha-300 rounded-lg text-white hover:text-mocha-500 duration-300">Fold away</button>
              </form>

              {/* Or divider */}
              <div className="my-4 flex items-center">
                <div className="border-t border-gray-300 flex-grow mr-3"></div>
                <span className="text-gray-500">or</span>
                <div className="border-t border-gray-300 flex-grow ml-3"></div>
              </div>

              <div className="text-gray-500 text-center">Upload from your favorite store:</div>

              {/* Upload button for favorite store */}
              <button className="mt-4 py-2 bg-red-700 text-white text-center rounded-lg "> Uniqlo </button>

              {/* Close button */}
              <button onClick={() => { setAdd(false) }} className="absolute top-0 right-0"><TiDelete className="text-3xl text-rose-600" /></button>
            </div>
          </div> : ''}

        </div> :
        notLoggedIn()
      }
    </>
  )
}
