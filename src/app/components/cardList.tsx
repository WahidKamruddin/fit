import Card from "./card";

const CardList = (props:any) => {

    const hasClothes = props.hasClothes;
    const cards = props.cards;
    
    return (
        <div className="w-7/8 h-full flex flex-wrap justify-center">
            {hasClothes? 
            cards.map((something:any) => ( <div className="mt-8 mx-10" key={something.id}><Card aClothing={something}/></div>))
            :<p className="pt-48 text-lg text-slate-500 font-light">Your closet is empty...</p>
          }
        </div>

    );
}

export default CardList;