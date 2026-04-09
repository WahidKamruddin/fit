'use client'

import Clothing from "@/src/app/classes/clothes";
import { useState } from "react";
import { HiViewGrid } from "react-icons/hi";
import { IoMdAdd } from "react-icons/io";
import { BiSortAlt2 } from "react-icons/bi";
import { TiDelete } from "react-icons/ti";
import { supabase } from "@/src/app/supabaseConfig/client";
import CardList from "@/src/app/components/card-list";
import { FileUploader } from "react-drag-drop-files";
import { useUser } from "@/src/app/auth/auth";
import NotLoggedIn from "@/src/app/components/not-logged-in";
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
        headers: {
          "X-Api-Key": process.env.NEXT_PUBLIC_BG_REMOVER_API_KEY!,
        },
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
    const path = `${user!.id}/${imageID}`;

    await supabase.storage.from('clothing-images').upload(path, processedFile);
    const { data: { publicUrl } } = supabase.storage.from('clothing-images').getPublicUrl(path);
    await addClothing(someClothing, publicUrl, imageID);
  };

  const addClothing = async (someClothing: Clothing, imgUrl: string, imageID: string) => {
    await supabase.from('clothes').insert({
      user_id: user!.id,
      name: someClothing.getName(),
      color: someClothing.getColor(),
      type: someClothing.getType(),
      image: imgUrl,
      image_id: imageID,
      material: someClothing.getMaterial(),
      style: someClothing.getStyle(),
    });
  };

  const filterAll = () => { setAll(true); setOuterWear(false); setTops(false); setBottoms(false); };
  const filterOuterWear = () => { setAll(false); setOuterWear(true); setTops(false); setBottoms(false); };
  const filterTops = () => { setAll(false); setOuterWear(false); setTops(true); setBottoms(false); };
  const filterBottoms = () => { setAll(false); setOuterWear(false); setTops(false); setBottoms(true); };

  if (!user) return <NotLoggedIn />;

  return (
    <div className="min-h-screen bg-off-white-100 text-black">
      <h1 className="pt-16 text-3xl sm:text-4xl px-4 sm:px-8 lg:px-20">{(user.user_metadata?.full_name ?? user.user_metadata?.name)?.split(' ')[0]}{"'s"} Closet</h1>

      {/* Header */}
      <div className="mt-5 px-4 sm:px-8 lg:px-20 flex flex-wrap gap-4 justify-between items-center">
        <ul className="flex gap-5 sm:gap-8 text-lg sm:text-xl font-light overflow-x-auto">
          <li className={`pb-1 border-b-2 whitespace-nowrap ${!all ? 'border-transparent' : 'border-black'} hover:border-black hover:duration-700`}><button onClick={filterAll}>All</button></li>
          <li className={`pb-1 border-b-2 whitespace-nowrap ${!outerWear ? 'border-transparent' : 'border-black'} hover:border-black hover:duration-700`}><button onClick={filterOuterWear}>Outerwear</button></li>
          <li className={`pb-1 border-b-2 whitespace-nowrap ${!tops ? 'border-transparent' : 'border-black'} hover:border-black hover:duration-700`}><button onClick={filterTops}>Tops</button></li>
          <li className={`pb-1 border-b-2 whitespace-nowrap ${!bottoms ? 'border-transparent' : 'border-black'} hover:border-black hover:duration-700`}><button onClick={filterBottoms}>Bottoms</button></li>
        </ul>
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="mt-2 bg-mocha-150 text-white py-2 px-3 rounded-lg flex items-center gap-1 cursor-not-allowed text-sm">Sort <BiSortAlt2 className="text-lg text-white" /></div>
          <div className="p-2 mt-2 bg-mocha-150 rounded-3xl cursor-not-allowed"><HiViewGrid className="text-xl text-white" /></div>
          <button onClick={() => setAdd(true)} className="p-2 mt-2 bg-mocha-150 rounded-3xl"><IoMdAdd className="text-xl text-white" /></button>
          <button onClick={() => setEdit(!edit)} className="p-2 mt-2 bg-mocha-150 rounded-3xl"><Pencil size={18} className="text-white"/></button>
        </div>
      </div>

      {/* Clothing cards */}
      <div className="mt-10 px-4 sm:px-8 lg:px-20 pb-12">
        {all ? <CardList userID={user.id} cards={cards} hasClothes={hasClothes} edit={edit} select={false} />
          : outerWear ? <CardList userID={user.id} cards={cards.filter((card) => card.clothing.getType() === 'Outerwear')} hasClothes={hasClothes} edit={edit} select={false} />
            : tops ? <CardList userID={user.id} cards={cards.filter((card) => card.clothing.getType() === 'Top')} hasClothes={hasClothes} edit={edit} select={false} />
              : bottoms ? <CardList userID={user.id} cards={cards.filter((card) => card.clothing.getType() === 'Bottom')} hasClothes={hasClothes} edit={edit} select={false} /> : null}
      </div>

      {/* Add clothing modal */}
      {add && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="relative w-full max-w-md bg-off-white-100 rounded-3xl p-8 sm:p-10 shadow-2xl">

            {/* Close button */}
            <button
              onClick={() => setAdd(false)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full border border-mocha-200 text-mocha-400 hover:border-mocha-400 hover:text-mocha-500 transition-all duration-200"
              aria-label="Close"
            >
              <span className="text-xs leading-none">✕</span>
            </button>

            {/* Header */}
            <p className="text-[10px] tracking-[0.5em] uppercase text-mocha-400 mb-3">New Item</p>
            <h2 className="font-cormorant text-4xl font-light text-mocha-500 leading-tight mb-8">
              Add to your<br />
              <span className="italic text-mocha-400">wardrobe.</span>
            </h2>

            <form onSubmit={createClothing} className="space-y-6">

              {/* Name */}
              <div>
                <label className="block text-[10px] tracking-[0.4em] uppercase text-mocha-400 mb-2">
                  Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Black wool coat"
                  onChange={(e) => setClothingName(e.target.value)}
                  className="w-full bg-transparent border-b border-mocha-200 py-2.5 text-mocha-500 text-sm placeholder:text-mocha-300/50 focus:outline-none focus:border-mocha-400 transition-colors duration-200"
                />
              </div>

              {/* Color */}
              <div>
                <label className="block text-[10px] tracking-[0.4em] uppercase text-mocha-400 mb-2">
                  Color
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Charcoal"
                  onChange={(e) => setClothingColor(e.target.value)}
                  className="w-full bg-transparent border-b border-mocha-200 py-2.5 text-mocha-500 text-sm placeholder:text-mocha-300/50 focus:outline-none focus:border-mocha-400 transition-colors duration-200"
                />
              </div>

              {/* Type */}
              <div>
                <label className="block text-[10px] tracking-[0.4em] uppercase text-mocha-400 mb-2">
                  Type
                </label>
                <select
                  required
                  onChange={(e) => setClothingType(e.target.value)}
                  className="w-full bg-transparent border-b border-mocha-200 py-2.5 text-mocha-500 text-sm focus:outline-none focus:border-mocha-400 transition-colors duration-200 appearance-none cursor-pointer"
                >
                  <option value="">Select a type</option>
                  <option>Outerwear</option>
                  <option>Top</option>
                  <option>Bottom</option>
                </select>
              </div>

              {/* Photo upload */}
              <div>
                <label className="block text-[10px] tracking-[0.4em] uppercase text-mocha-400 mb-3">
                  Photo
                </label>
                <div className="border border-dashed border-mocha-300 rounded-2xl p-5">
                  <FileUploader
                    multiple={false}
                    handleChange={(e: File) => setFile(e)}
                    types={fileTypes}
                    name="file"
                    label="Upload or drop a photo here"
                  />
                </div>
                {file && (
                  <p className="mt-2 text-[10px] tracking-[0.25em] text-mocha-400 truncate">
                    {file.name}
                  </p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-mocha-500 text-mocha-100 text-[11px] tracking-[0.3em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300"
              >
                Fold Away
              </button>
            </form>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="flex-1 h-px bg-mocha-200" />
              <span className="text-[10px] tracking-[0.3em] uppercase text-mocha-300">or</span>
              <div className="flex-1 h-px bg-mocha-200" />
            </div>

            <p className="text-[10px] tracking-[0.3em] uppercase text-mocha-400 text-center mb-3">
              Upload from your favourite store
            </p>
            <button
              disabled
              className="w-full py-3 border border-mocha-200 text-mocha-300 text-[11px] tracking-[0.3em] uppercase rounded-full cursor-not-allowed"
            >
              Uniqlo
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
