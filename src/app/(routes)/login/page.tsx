'use client'

import { googleSignIn, logOut, useUser } from "../../auth/auth"
import Link from "next/link";
import { redirect } from "next/navigation";

export default function login() {
    const user = useUser();

    //redirects if the user is logged in already
    if (user != null) {
        redirect('/');
    }

    return (
        <div className="h-screen flex items-center justify-center">
            <form className="bg-white p-8 rounded shadow-md">
                <h2 className="text-2xl font-semibold mb-6">Login</h2>
                <div className="mb-4">
                <label htmlFor="username" className="block text-gray-600 text-sm font-medium mb-2">
                    Username
                </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    className="border rounded w-full py-2 px-3 cursor-not-allowed"
                    disabled
                />
                </div>
                <div className="mb-4">
                <label htmlFor="password" className="block text-gray-600 text-sm font-medium mb-2">
                    Password
                </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    className="border rounded w-full py-2 px-3 cursor-not-allowed"
                    disabled
                />
                </div>
                <div className="flex justify-center">
                    <button
                    type="submit"
                    className="bg-blue-500 text-white rounded py-2 px-4 justify-center cursor-not-allowed"
                    disabled
                    >
                    Login
                    </button>
                </div>
                

                <div className="my-4 flex items-center">
                    <div className="border-t border-gray-300 flex-grow mr-3"></div>
                    <span className="text-gray-500">or</span>
                    <div className="border-t border-gray-300 flex-grow ml-3"></div>
                </div>
                <div className="flex justify-center">
                    <button
                    type="button"
                    className="bg-red-500 text-white rounded py-2 px-4 hover:bg-red-600"
                    onClick={(e)=>{googleSignIn(e)}}
                    >
                    Sign in with Google
                    </button>
                </div>
                
            </form>
        </div>
    )
}





    
