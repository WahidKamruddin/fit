'use client'

import Clothing from "../../classes/clothes";
import { useEffect, useState } from "react";
import { PiSparkleFill } from "react-icons/pi";
import { FaCalendarAlt } from "react-icons/fa";

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
import Link from "next/link";

export default function Closet() {
  //Define User
  const user = useUser();
  const [userID, setUserID] = useState(null);

  
  useEffect(() => {
    if (user != null) {
      setUserID(user.uid);
    }


  }, [user,userID]);



  return (
    <div>
      {user?
      <div className="h-screen pt-16 bg-off-white-100 text-black relative"> 
          <h1 className="mx-20 text-4xl">{user.displayName.split(' ')[0]}'s Dashboard</h1>  

          <div className="flex w-full h-full py-10 px-20 text-center">
            <div className="mr-6 w-7/12 flex flex-col justify-between">
                <div className="w-full flex justify-between">
                    <div className="w-7/12 h-14 rounded-2xl flex justify-center items-center"> 
                      <span className="text-lg bg-clip-text text-transparent gemeni bg-left hover:bg-right duration-500 ease-in-out">Generate with Gemeni</span>
                    </div>
                    <div className="bg-gray-300 w-1/12 rounded-2xl flex justify-center items-center text-2xl">  <Link href='/calendar'><FaCalendarAlt/> </Link> </div>
                </div>

                <Link href="/outfits"><div className="w-full h-72 bg-gray-300 rounded-2xl flex justify-center items-center text-2xl">My Outfits</div></Link>

                <Link href='/closet'><div className="mb-8 w-full h-48 bg-gray-300 rounded-2xl flex justify-center items-center text-2xl">My Closet</div></Link>
            </div>

            <div className="ml-6 w-5/12 flex flex-col justify-between">
                <div className="w-full h-5/6 bg-gray-300 rounded-2xl flex justify-center items-center text-2xl cursor-not-allowed">
                  Coming Soon!
                </div>
                <div className="my-8 w-full h-1/6 flex justify-evenly">
                    <div className="p-12 bg-gray-300 rounded-2xl"></div>
                    <div className="p-12 bg-gray-300 rounded-2xl"></div>
                    <div className="p-12 bg-gray-300 rounded-2xl"></div>
                    <div className="p-12 bg-gray-300 rounded-2xl"></div>
                </div>
            </div>
          </div>
      </div> :      
        notLoggedIn()
      }
    </div>
  )
}
 