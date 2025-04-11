import { FaMinusCircle } from "react-icons/fa";
import {FaStar} from "react-icons/fa"
import {AiOutlineStar, AiOutlineDelete} from "react-icons/ai"
import { useEffect, useState } from "react"
import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebaseConfig/clientApp";
import Clothing from "../classes/clothes";


const OutfitCard = (props:any) => {
    
    const userID = props.userID;
    const outfit = props.outfit
    const clothes = props.clothes;
    const edit = props.canEdit;
    const date = props.deleteDate;

    const outerWear = outfit.OuterWear;
    const top = outfit.Top;
    const bottom = outfit.Bottom;

    const [oWImg, setoWImg] = useState();
    const [topImg, setTopImg] = useState();
    const [botImg, setBotImg] = useState();

    const deleteOutfit = async (id:any) => {
        await deleteDoc(doc(db, `users/${userID}/outfits`, outfit.id));
      };

    const deleteDate = async (id:any) => {
        await updateDoc(doc(db, `users/${userID}/outfits`, outfit.id), {
            Date: null,
          });
    };

    useEffect(() => {
        for (let i = 0; i < clothes.length; i++) {
            if (clothes[i].id) {
                if (clothes[i].id === outerWear) { setoWImg(clothes[i].clothing.imageUrl); }
                if (clothes[i].id === top) { setTopImg(clothes[i].clothing.imageUrl); }
                if (clothes[i].id === bottom) { setBotImg(clothes[i].clothing.imageUrl); }
            }
        }
      }, [clothes, outerWear]);

    return (
        <div className="relative my-12">
            {edit? <button className="absolute top-0 right-0 p-2 bg-red-600 rounded-xl" onClick={deleteOutfit}></button> : null}
            {date? <button className="absolute top-0 right-0 p-2 bg-red-600 rounded-xl" onClick={deleteDate}></button> : null}
            
            {oWImg?  <div className=""><img src={oWImg}  className="p-4 min-w-48 h-48"/></div> : null}
            {topImg? <div className="absolute top-10"><img src={topImg} className="p-4 min-w-48 h-48"/></div> : null}
            {botImg? <div className="absolute top-20"><img src={botImg} className="p-4 min-w-48 h-48"/></div> : null}
        </div>
    )
    
}


export default OutfitCard;
