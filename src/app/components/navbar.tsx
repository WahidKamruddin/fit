import {BsFillBellFill, BsFillPersonFill, BsFillTelephoneFill} from "react-icons/bs";
import {AiFillHome} from "react-icons/Ai";


export default function Navbar() {
    return(
        <div className="w-full flex justify-end">
            <ul className="mt-5 mr-2 flex cursor-pointer">
                <li className="mr-10"><AiFillHome size={23}/></li>
                <li className="mr-10"><BsFillPersonFill size={23}/></li>
                <li className="mr-10"><BsFillTelephoneFill size={20}/></li>
                <li className="mr-10"><BsFillBellFill size={20}/></li>
            </ul>
            
        </div>
    )
}