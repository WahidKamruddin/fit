'use client'

import { redirect } from "next/navigation";
import { logOut, useUser } from "../../auth/auth";
import notLoggedIn from "../../components/notLoggedIn";
import { FaArrowCircleRight } from "react-icons/fa";
import Link from "next/link";




export default function User() {
    const user = useUser();

    
    return(
        <div className="h-screen pt-16 text-black">
            {user? 
            
            <div className="container mx-auto mt-8">
              <div className="bg-white p-4 shadow-md rounded-md">
                <div className="flex flex-col items-center justify-center">
                    <img src={user.photoURL} alt="Profile" className="w-32 h-auto rounded-full object-cover" referrerPolicy="no-referrer"/>
                    <h1 className="mt-6 text-xl">Welcome, {user.displayName}!</h1>
                </div>
                <div className="mt-10 text-center flex justify-evenly">
                    <Link href='/closet'>
                        <div className="bg-white p-6 rounded-md shadow-md mr-4 flex flex-col jusitfy-center items-center hover:scale-105">
                            <h2 className="text-xl font-bold mb-4">My Closet</h2>
                            <p className="text-gray-600">Explore and manage your wardrobe collection.</p>
                            <div className="mt-6 text-2xl text-mocha-400"><FaArrowCircleRight/></div>
                        </div>
                    </Link>

                    <Link href='/'>
                        <div className="bg-white p-6 rounded-md shadow-md flex flex-col jusitfy-center items-center cursor-not-allowed">
                            <h1 className="w-full p-2 rounded-lg text-xl font-bold mb-4 text-white bg-red-600">COMING SOON</h1>
                            <h2 className="text-xl font-bold mb-4">My Outfits</h2>
                            <p className="text-gray-600">Create and view your stylish outfits.</p>
                            <div className="mt-6 text-2xl text-mocha-400"><FaArrowCircleRight/></div>
                        </div>
                    </Link>

                </div>
              </div>
              <button onClick={logOut} className="bg-red-500 text-white px-4 py-2 mt-4 rounded-md hover:bg-red-600"> Sign Out </button>
          </div>
            :
            notLoggedIn()
        }
        </div>
    )
}