'use client'

import Clothing from "@/src/app/classes/clothes";
import { useState } from "react";
import { HiViewGrid } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import { BiSortAlt2 } from "react-icons/bi";
import { TiDelete } from "react-icons/ti";
import { db, storage } from "@/src/app/firebaseConfig/clientApp";
import { addDoc, collection } from "firebase/firestore";
import CardList from "@/src/app/components/card-list";
import { FileUploader } from "react-drag-drop-files";
import { useUser } from "@/src/app/auth/auth";
import NotLoggedIn from "@/src/app/components/not-logged-in";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { v4 } from "uuid";
import { useCloset } from "@/src/app/providers/closetContext";
import { Pencil } from "lucide-react";


export default function Closet() {
  const user = useUser();

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
  const { cards, hasClothes } = useCloset();

  // Add data states
  const [add, setAdd] = useState(false);
  const [edit, setEdit] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [img, setImg] = useState<string | null>(null);

  const fileTypes = ["JPG", "JPEG", "PNG", "GIF"];

  // Function to handle background removal
  const handleBackgroundRemoval = async (): Promise<File | null> => {
    if (!file) return null;

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/remove-background`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();
        const processedImageFile = new File([blob], "processed-image.png", { type: "image/png" });
        setImg(URL.createObjectURL(blob));
        return processedImageFile;
      } else {
        throw new Error("Failed to remove background");
      }
    } catch (error) {
      console.error("Error removing background:", error);
    }
    return null;
  };

  const createClothing = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdd(false);

    const processedFile = await handleBackgroundRemoval();

    if (processedFile && user) {
      const someClothing = new Clothing(clothingName, clothingColor, clothingType);
      await addItem(someClothing, processedFile);
    }
  };

  const addItem = async (someClothing: Clothing, processedFile: File) => {
    const imageID = v4();
    const imageRef = ref(storage, `${user!.uid}/${imageID}`);

    const data = await uploadBytes(imageRef, processedFile);
    const url = await getDownloadURL(data.ref);
    await addClothing(someClothing, url, imageID);
  };

  const addClothing = async (someClothing: Clothing, imgUrl: string, imageID: string) => {
    await addDoc(collection(db, `users/${user!.uid}/clothes`), {
      Color: someClothing.getColor(),
      Material: someClothing.getMaterial(),
      Name: someClothing.getName(),
      Style: someClothing.getStyle(),
      Type: someClothing.getType(),
      Image: imgUrl,
      ImageID: imageID,
    });
  };

  const filterAll = () => { setAll(true); setOuterWear(false); setTops(false); setBottoms(false); };
  const filterOuterWear = () => { setAll(false); setOuterWear(true); setTops(false); setBottoms(false); };
  const filterTops = () => { setAll(false); setOuterWear(false); setTops(true); setBottoms(false); };
  const filterBottoms = () => { setAll(false); setOuterWear(false); setTops(false); setBottoms(true); };

  if (!user) return <NotLoggedIn />;

  return (
    <div className="h-screen bg-off-white-100 text-black">
      <h1 className="pt-16 text-4xl mx-20">{user.displayName?.split(' ')[0]}'s Closet</h1>

      {/* Header */}
      <div className="mt-5 mx-20 flex justify-between">
        <ul className="w-2/6 mt-4 text-xl font-light justify-self-start flex justify-between">
          <li className={`pb-1 border-b-2 ${!all && `border-transparent`} ${all && `border-black`} hover:border-black hover:duration-700`}><button onClick={filterAll}>All</button></li>
          <li className={`pb-1 border-b-2 ${!outerWear && `border-transparent`} ${outerWear && `border-black`} hover:border-black hover:duration-700`}><button onClick={filterOuterWear}>Outerwear</button></li>
          <li className={`pb-1 border-b-2 ${!tops && `border-transparent`} ${tops && `border-black`} hover:border-black hover:duration-700`}><button onClick={filterTops}>Tops</button></li>
          <li className={`pb-1 border-b-2 ${!bottoms && `border-transparent`} ${bottoms && `border-black`} hover:border-black hover:duration-700`}><button onClick={filterBottoms}>Bottoms</button></li>
        </ul>
        <div className="w-3/6 flex justify-center">
          <div className="mx-8 mt-2 bg-mocha-150 text-white py-2 px-4 rounded-lg flex cursor-not-allowed">Sort by <BiSortAlt2 className="text-xl text-white" /> </div>
          <div className="mx-8 p-2 mt-2 bg-mocha-150 rounded-3xl cursor-not-allowed"><HiViewGrid className="text-2xl text-white" /></div>
          <button onClick={() => { setAdd(true) }} className="mx-8 p-2 mt-2 bg-mocha-150 rounded-3xl"><IoMdAdd className="text-2xl text-white" /></button>
          <button onClick={() => { setEdit(!edit) }} className="mx-8 p-2 mt-2 bg-mocha-150 rounded-3xl"><Pencil className="text-white"/></button>
        </div>
      </div>

      {/* Clothing cards */}
      <div className="mt-10 mx-20 h-4/6 flex justify-center">
        {all ? <CardList userID={user.uid} cards={cards} hasClothes={hasClothes} edit={edit} select={false} />
          : outerWear ? <CardList userID={user.uid} cards={cards.filter((card) => card.clothing.getType() === 'Outerwear')} hasClothes={hasClothes} edit={edit} select={false} />
            : tops ? <CardList userID={user.uid} cards={cards.filter((card) => card.clothing.getType() === 'Top')} hasClothes={hasClothes} edit={edit} select={false} />
              : bottoms ? <CardList userID={user.uid} cards={cards.filter((card) => card.clothing.getType() === 'Bottom')} hasClothes={hasClothes} edit={edit} select={false} /> : null}
      </div>

      {/* Add clothing modal */}
      {add && (
        <div className="absolute w-full h-full top-0 bg-black z-50 flex justify-center items-center bg-opacity-20">
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
                handleChange={(e: File) => setFile(e)}
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

            <button className="mt-4 py-2 bg-red-700 text-white text-center rounded-lg"> Uniqlo </button>

            {/* Close button */}
            <button onClick={() => { setAdd(false) }} className="absolute top-0 right-0"><TiDelete className="text-3xl text-rose-600" /></button>
          </div>
        </div>
      )}
    </div>
  );
}
