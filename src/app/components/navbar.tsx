"use client"

import Link from 'next/link'
import { useUser, logOut } from '../auth/auth'

export default function Navbar() {
    const user = useUser();

    return(
        <div id="navbar" className="fixed w-full bg-off-white-100 flex justify-center z-50">
            <ul className="pt-4 pb-2 flex cursor-pointer">
                <li className="mx-4 text-black pb-1 border-transparent border-b-2  hover:border-black hover:duration-700 "><Link href="/">Home</Link></li>
                <li className="mx-4 text-black pb-1 border-transparent border-b-2  hover:border-black hover:duration-700 cursor-not-allowed "><Link href="" className='cursor-not-allowed'>FAQ</Link></li>
                <li className="mx-4 text-black pb-1 border-transparent border-b-2  hover:border-black hover:duration-700 ">{!user? <Link href="/login">Login</Link> : <Link href="/user">Dashboard</Link>}</li>
                <li className="mx-4 text-black pb-1 border-transparent border-b-2  hover:border-black hover:duration-700 cursor-not-allowed "><Link href="" className='cursor-not-allowed'>Settings</Link></li>
            </ul>
        </div>
    )
}