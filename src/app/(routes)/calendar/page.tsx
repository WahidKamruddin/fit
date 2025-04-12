'use client'

import { useEffect, useState } from "react";
import { useUser } from "../../auth/auth";
import { db } from "../../firebaseConfig/clientApp";
import { collection, doc, onSnapshot, query, updateDoc } from "firebase/firestore";
import { add, eachDayOfInterval, endOfMonth, format, getDay, isEqual, isToday, parse, startOfMonth, startOfToday } from "date-fns";
import notLoggedIn from "../../components/notLoggedIn";
import Clothing from "../../classes/clothes";
import OutfitCard from "../../components/outfitCard";
import { TiDelete } from "react-icons/ti";
import { IoMdAdd } from "react-icons/io";
import { ArrowLeft, ArrowRight } from "lucide-react";

// Define the Outfit type
interface Outfit {
  id: string;
  Date: string; // The 'Mddyy' formatted date as a string
  name?: string;
  description?: string;
}

export default function Closet() {
  const user = useUser();
  const [userID, setUserID] = useState<string | null>(null);
  const [outfitArr, setOutfitArr] = useState<Outfit[]>([]); // Define array of outfits
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [fit, setFit] = useState(null);

  //fetch data states
  const [hasClothes, setHasClothes] = useState(false);
  const [cards, setCards] = useState([]);

  const [addButton, setAddButton] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      setUserID(user.uid);
    }

    //fetches user data
    const c = query(collection(db, `users/${userID}/clothes`));

    //fetch clothes
    const cData = onSnapshot(c, (QuerySnapshot) => {
      let itemsArr: any = [];
      let clothesArr: any = [];

      QuerySnapshot.forEach((doc) => {
        itemsArr.push({ ...doc.data(), id: doc.id });
      });

      for (let i = 0; i < itemsArr.length; i++) {
        let clothing: Clothing | null = new Clothing(
          itemsArr[i].Name,
          itemsArr[i].Color,
          itemsArr[i].Type,
          itemsArr[i].Image,
          itemsArr[i].Style
        );
        clothesArr.push({ clothing, id: itemsArr[i].id });
        clothing = null;
      }

      setCards(clothesArr);

      if (clothesArr.length >= 1) {
        setHasClothes(true);
      }
    });

    if (userID) {
      const o = query(collection(db, `users/${userID}/outfits`));
      onSnapshot(o, (QuerySnapshot) => {
        const outfits: Outfit[] = [];
        QuerySnapshot.forEach((doc) => {
          outfits.push({ ...doc.data(), id: doc.id } as Outfit); // Type assertion
        });
        setOutfitArr(outfits);
      });
    }
  }, [user, userID]);

  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, 'MMM-yyyy'));
  const firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date());

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  const nextMonth = () => {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, 'MMM-yyyy'));
  };

  const prevMonth = () => {
    const firstDayPrevMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayPrevMonth, 'MMM-yyyy'));
  };

  const renderOutfit = () => {
    const formattedSelectedDay = format(selectedDay, 'MMddyy');


    const matchingOutfit = outfitArr.find((outfit: Outfit) => outfit.Date === formattedSelectedDay);

    if (matchingOutfit) {
      setOutfit(matchingOutfit);
      console.log(outfit);
    } else {
      setOutfit(null);
    }
  };

  useEffect(() => {
    renderOutfit();
  }, [selectedDay, outfitArr]);

  const handleOutfit = async (id: any) => {
    await updateDoc(doc(db, `users/${userID}/outfits/${id}`), {
      Date: format(selectedDay, 'MMddyy'),
    });

    setAddButton(false);
  }

  return (
    <div>
      {user ? (
        <div className="h-screen pt-16 bg-off-white-100 text-black relative">
          <h1 className="mx-20 text-4xl">
            {user.displayName.split(' ')[0]}'s Calendar
          </h1>

          <div className="px-20 mr-20 mt-10 w-full flex justify-between">
            <div className="max-w-2xl w-4/6 shadow-lg rounded-xl">
              <div className="p-10 bg-white rounded-xl">
                <div className="px-4 flex items-center justify-between">
                  <span className="text-base font-bold text-gray-800">
                    {format(currentMonth, 'MMMM yyyy')}
                  </span>
                  <div className="flex items-center">
                    <button aria-label="calendar backward" onClick={prevMonth} className="text-gray-800 hover:text-gray-400">
                      <ArrowLeft />
                    </button>
                    <button aria-label="calendar forward" onClick={nextMonth} className="ml-3 text-gray-800 hover:text-gray-400">
                      <ArrowRight />
                    </button>
                  </div>
                </div>
                <div className="grid grid-cols-7 mt-10 mb-2 text-md leading-6 text-center text-gray-500">
                  <div>Mon</div>
                  <div>Tue</div>
                  <div>Wed</div>
                  <div>Thu</div>
                  <div>Fri</div>
                  <div>Sat</div>
                  <div>Sun</div>
                </div>
                <div className="grid grid-cols-7 mt-2 text-md text-black">
                  {days.map((day: any, dayIdx: any) => (
                    <div
                      className={`${dayIdx === 0 && colStartClasses[getDay(day)]} py-2 flex justify-center items-center`}
                      key={day.toString()}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedDay(day)}
                        className={`
                          h-10 w-10 text-center rounded-full text-black 
                          ${!isEqual(day, selectedDay) && 'hover:bg-gray-200 ease-in'}
                          ${isToday(day) && !isEqual(day, selectedDay) && 'text-indigo-400 font-semibold'}
                          ${isToday(day) && isEqual(day, selectedDay) && 'bg-indigo-400 text-white font-semibold'}
                          ${isEqual(day, selectedDay) && 'bg-black text-white font-semibold'}
                        `}
                      >
                        <time dateTime={format(day, 'MM-dd-yyyy')}>
                          {format(day, 'd')}
                        </time>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="w-5/12 p-4 bg-gray-400 rounded-xl">
              {outfit ? (
                <div>
                  {/* Render the outfit details */}
                  <h2>theres an outfit</h2>
                  <p>yippee</p>
                  <OutfitCard userID={userID} outfit={outfit} clothes={cards} deleteDate={true} />
                </div>
              ) : (
                <div>
                  <p>No outfit for this day.</p>
                  <p>{format(selectedDay, 'MMddyy')}</p>
                  <button onClick={() => { setAddButton(true) }} className="mx-8 p-2 mt-2 bg-mocha-150 rounded-3xl"><IoMdAdd className="text-2xl text-white" /></button>
                </div>
              )}
            </div>
          </div>

          {/* add button, turn into a component! */}
          {addButton ? <div className="absolute w-full h-full top-0 bg-black z-50 flex justify-center items-center bg-opacity-20">
            <div className="w-3/4 h-4/6 p-3 bg-white opacity-100 rounded-xl">
              <div className="h-4/6 flex justify-center">
                <div className="w-7/8 h-full flex flex-wrap justify-center overflow-y-scroll ">
                  {outfitArr
                    ? outfitArr.map((something: any) => (
                      <div key={something.id}>
                        <div className="">
                          <button className={fit === something.id ? "bg-indigo-400 text-white" : "bg-white"} onClick={() => setFit(something.id)}><OutfitCard userID={userID} outfit={something} clothes={cards} canEdit={false} deleteDate={true} /></button>
                        </div>
                      </div>
                    ))
                    : null}
                </div>
              </div>


              <button
                className="w-fit mt-6 p-2 px-3 bg-mocha-300 rounded-lg text-white hover:text-mocha-500 duration-300"
                onClick={() => fit && handleOutfit(fit)}
                disabled={!fit}
              >
                Fold away
              </button>

              {/* X button */}
              <button onClick={() => { setAddButton(false) }} className="absolute top-0 right-0"><TiDelete className="text-3xl text-rose-600" /></button>
            </div>
          </div> : ''}
        </div>
      ) : (
        notLoggedIn()
      )}
    </div>
  );
}

const colStartClasses = [
  'col-start-0',
  'col-start-1',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7'
];
