import {BsBell, BsPerson, BsTelephone} from "react-icons/bs";
import {BiHomeAlt2} from "react-icons/bi";


export default function Navbar() {
    return(
        <div id="navbar" className="w-full t-0 bg-transparent absolute flex justify-end">
            <ul className="mr-1 py-6 flex cursor-pointer">
                <li className="mr-10 flex pb-2 border-transparent border-b-2  hover:border-white hover:duration-700 "><BiHomeAlt2 size={23} color="white"/></li>
                <li className="mr-10 flex pb-2 border-transparent border-b-2  hover:border-white hover:duration-700 "><BsPerson size={23}/></li>
                <li className="mr-10 flex pb-2 border-transparent border-b-2  hover:border-white hover:duration-700 "><BsTelephone size={20}/></li>
                <li className="mr-10 flex pb-2 border-transparent border-b-2  hover:border-white hover:duration-700 "><BsBell size={20}/></li>
            </ul>
            
        </div>
    )
}