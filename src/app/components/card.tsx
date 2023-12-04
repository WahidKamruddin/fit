import Clothing from "../class"
import {LiaEditSolid} from "react-icons/lia"
import {FaStar} from "react-icons/fa"
import {AiOutlineStar} from "react-icons/ai"
import { useState } from "react"
import Image from "next/image"

export default function Card(aClothing : Clothing) {

    const [isActive, setIsActive] = useState(true);

    return(
        <div className="relative bg-black rounded-xl group">
            <div className="relative bg-olive-100 rounded-xl select-none">
                <button className="absolute top-0 right-0 p-1 text-center text-md text-white bg-olive-200 rounded-xl drop-shadow-xl z-10"><LiaEditSolid/></button>
                <button className="absolute top-2 left-2 text-xl text-white cursor-pointer z-10">
                    {isActive? <AiOutlineStar onClick={()=>{setIsActive(!isActive)}}/>:<FaStar onClick={()=>{setIsActive(!isActive)}} className="text-amber-500"/>}
                </button>
                <Image alt="clothing" src="../img/jacket.png" width={225} height={225} className="p-4 group-hover:blur-sm z-0"/>
            </div>
            <div className="absolute top-0 w-full h-full bg-transparent text-transparent group-hover:text-white flex justify-center items-center">
                <div className="h-fit">
                    <h1 className="relative">{aClothing.getName()}</h1>
                </div>
            </div>
        </div>
        
    )
}

