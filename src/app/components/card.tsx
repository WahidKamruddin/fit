import { FaMinusCircle } from "react-icons/fa";
import {FaStar} from "react-icons/fa"
import {AiOutlineStar, AiOutlineDelete} from "react-icons/ai"
import { useState } from "react"
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebaseConfig/clientApp";
import Clothing from "../classes/clothes";


const Card = (props:any) => {
    
    const userID = props.userID;
    const aClothing = props.aClothing;
    const edit = props.edit;
    const select = props.select;

    const handleOuterWear = (item:Clothing, id:any) => {
        props.handleOuterWear(item, id);
    }

    const [isActive, setIsActive] = useState(true);
    
    function favorite() {
        setIsActive(!isActive);
        aClothing.starred = true;
    }

    function unfavorite () {
        setIsActive(!isActive);
        aClothing.starred = false;
    }

    const deleteClothing = async (id:any) => {
        console.log(userID);
         console.log(aClothing.id);
        await deleteDoc(doc(db, `users/${userID}/clothes`, aClothing.id));
      };

    return(
        <div className="relative bg-black rounded-xl group">
            <div className="relative bg-gray-100 border-2 rounded-xl select-none">
                {/* delete */}
                {edit? 
                <button className="absolute top-0 right-0 m-1 text-center text-md text-red-600 bg-white rounded-xl drop-shadow-xl z-10" onClick={deleteClothing}><FaMinusCircle/></button>:
                null}


                {/* favorite */}
                <button className="absolute top-2 left-2 text-xl text-yellow-500 cursor-pointer z-10">
                    {isActive? <AiOutlineStar onClick={() => favorite()}/>:<FaStar onClick={() => unfavorite()} className="text-amber-500"/>}
                </button>

                {/* image */}
                <img alt="clothing" src={aClothing.clothing.getImageUrl()} className="p-4 min-w-48 h-48 group-hover:blur-sm z-0"/>
            </div>

            {/* text hover */}
            {select? 
            <button onClick={()=> handleOuterWear(aClothing.clothing, aClothing.id)}className="absolute top-0 w-full h-full bg-transparent text-transparent group-hover:text-white flex justify-center items-center">
                <div className="h-fit">
                    <h1 className="relative">{aClothing.clothing.getName()}</h1>
                </div>
            </button>:
            <div className="absolute top-0 w-full h-full bg-transparent text-transparent group-hover:text-white flex justify-center items-center">
                <div className="h-fit">
                    <h1 className="relative">{aClothing.clothing.getName()}</h1>
                </div>
            </div>
            }
        </div>
        
    )
}


export default Card;
