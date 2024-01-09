import { FaMinusCircle } from "react-icons/fa";
import {FaStar} from "react-icons/fa"
import {AiOutlineStar, AiOutlineDelete} from "react-icons/ai"
import { useState } from "react"
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase/clientApp";


export default function Card({ aClothing }: { aClothing: any }) {

    const [isActive, setIsActive] = useState(true);
    const [isEdit, setIsEdit] = useState(false);

    function favorite() {
        setIsActive(!isActive);
        aClothing.starred = true;
    }

    function unfavorite () {
        setIsActive(!isActive);
        aClothing.starred = false;
    }

    const deleteClothing = async (id:any) => {
        await deleteDoc(doc(db, "Clothes", aClothing.id));
      };

    return(
        <div className="relative bg-black rounded-xl group">
            <div className="relative bg-olive-100 rounded-xl select-none">
                {/* delete */}
                <button className="absolute top-0 right-0 m-1 text-center text-md text-red-600 bg-white rounded-xl drop-shadow-xl z-10" onClick={deleteClothing}><FaMinusCircle/></button>


                {/* favorite */}
                <button className="absolute top-2 left-2 text-xl text-white cursor-pointer z-10">
                    {isActive? <AiOutlineStar onClick={() => favorite()}/>:<FaStar onClick={() => unfavorite()} className="text-amber-500"/>}
                </button>

                {/* image */}
                <img alt="clothing" src="../img/jacket.png" width={225} height={225} className="p-4 group-hover:blur-sm z-0"/>
            </div>

            {/* text hover */}
            <div className="absolute top-0 w-full h-full bg-transparent text-transparent group-hover:text-white flex justify-center items-center">
                <div className="h-fit">
                    <h1 className="relative">{aClothing.clothing.getName()}</h1>
                </div>
            </div>
        </div>
        
    )
}

