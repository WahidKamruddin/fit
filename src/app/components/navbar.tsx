"use client"

import {BsBell} from "react-icons/bs";
import {BiHomeAlt2} from "react-icons/bi";
import {AiOutlineQuestionCircle} from "react-icons/ai";
import {RiTimeLine} from "react-icons/ri";
import Link from 'next/link'

export default function Navbar() {
    return(
        <div id="navbar" className="w-full t-0 bg-transparent absolute flex justify-end">
            <ul className="mr-1 py-6 flex cursor-pointer">
                <li className="mr-10 flex pb-2 border-transparent border-b-2  hover:border-white hover:duration-700 "><Link href="#home"><BiHomeAlt2 size={23} color="white"/></Link></li>
                <li className="mr-10 flex pb-2 border-transparent border-b-2  hover:border-white hover:duration-700 "><Link href="#about"><AiOutlineQuestionCircle size={23}/></Link></li>
                <li className="mr-10 flex pb-2 border-transparent border-b-2  hover:border-white hover:duration-700 "><Link href="#timeline"><RiTimeLine size={23}/></Link></li>
                <li className="mr-10 flex pb-2 border-transparent border-b-2  hover:border-white hover:duration-700 "><Link href="#notif"><BsBell size={20}/></Link></li>
            </ul>
            
        </div>
    )
}