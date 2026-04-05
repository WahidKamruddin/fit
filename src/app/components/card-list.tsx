import Card from "./card";
import Clothing from "../classes/clothes";

interface ClothingCard {
  clothing: Clothing;
  id: string;
}

interface CardListProps {
  userID: string | null;
  cards: ClothingCard[];
  hasClothes: boolean;
  edit: boolean;
  select: boolean;
  handleOuterWear?: (item: Clothing, id: string) => void;
}

const CardList = ({ userID, cards, hasClothes, edit, select, handleOuterWear }: CardListProps) => {
  return (
    <div className="w-7/8 h-full flex flex-wrap justify-center overflow-y-scroll">
      {hasClothes ? (
        cards.map((something) => (
          <div className="mt-8 mx-10 min-w-max" key={something.id}>
            <Card
              userID={userID ?? ""}
              aClothing={something}
              edit={edit}
              select={select}
              handleOuterWear={handleOuterWear}
            />
          </div>
        ))
      ) : (
        <p className="pt-48 text-lg text-slate-500 font-light">Your closet is empty...</p>
      )}
    </div>
  );
};

export default CardList;
