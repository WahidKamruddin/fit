import { useEffect } from "react";
import Card from "./card";

const CardList = (props:any) => {

    const hasClothes = props.hasClothes;
    const cards = props.cards;
    const userID = props.userID;
    const edit = props.edit;
    const select = props.select;


    const handleOuterWear = (img:any, type:any) => {
        props.handleOuterWear(img, type);
    }
    
    return (
        <div className={`w-7/8 h-full flex flex-wrap justify-center overflow-y-scroll`}>
            {hasClothes? 
            cards.map((something:any) => ( <div className="mt-8 mx-10 min-w-max" key={something.id}><Card userID={userID} aClothing={something} edit={edit} select={select} handleOuterWear={handleOuterWear}/></div>))
            :<p className="pt-48 text-lg text-slate-500 font-light">Your closet is empty...</p>
          }
        </div>

    );
}

export default CardList;