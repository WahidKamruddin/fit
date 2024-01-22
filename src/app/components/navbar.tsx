"use client"

import Link from 'next/link'
import { useUser, logOut } from '../auth/auth'

export default function Navbar() {
    const user = useUser();

    return(
        <div id="navbar" className="fixed w-full bg-off-white-100 flex justify-end z-50">
            <ul className="mr-1 pt-3 pb-2 flex cursor-pointer">
                <li className="mr-10 text-black flex pb-1 border-transparent border-b-2  hover:border-black hover:duration-700 "><Link href="/">Home</Link></li>
                <li className="mr-10 text-black flex pb-1 border-transparent border-b-2  hover:border-black hover:duration-700 cursor-not-allowed "><Link href="" className='cursor-not-allowed'>FAQ</Link></li>
                {!user? null : <li className="mr-10 text-black flex pb-1 border-transparent border-b-2  hover:border-black hover:duration-700 "><Link href="/closet">Closet</Link></li>}
                <li className="mr-10 text-black flex pb-1 border-transparent border-b-2  hover:border-black hover:duration-700 ">{!user? <Link href="/login">Login/Sign Up</Link> : <button onClick={logOut}>Sign out </button>}</li>
            </ul>
        </div>
    )
}