'use client'

import { useEffect, useState } from "react";
import { useUser } from "../../auth/auth";
import { db } from "../../firebaseConfig/clientApp";
import { collection, onSnapshot, query } from "firebase/firestore";
import { add, eachDayOfInterval, endOfMonth, format, getDay, isEqual, isToday, parse, startOfMonth, startOfToday } from "date-fns";
import notLoggedIn from "../../components/notLoggedIn";
import Clothing from "../../classes/clothes";
import OutfitCard from "../../components/outfits";

// Define the Outfit type
interface Outfit {
  id: string;
  date: string; // The 'Mddyy' formatted date as a string
  name?: string;
  description?: string;
}

export default function Closet() {
  const user = useUser();
  const [userID, setUserID] = useState<string | null>(null);
  const [outfitArr, setOutfitArr] = useState<Outfit[]>([]); // Define array of outfits
  const [outfit, setOutfit] = useState<Outfit | null>(null);

  //Clothing states
  const [outerWear, setOuterWear] = useState<any | null>(null);
  const [top, setTop] = useState<any | null>(null);
  const [bottom, setBottom] = useState<any | null>(null);

  //fetch data states
  const [hasClothes, setHasClothes] = useState(false);
  const [cards, setCards] = useState([]);
  
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
    const formattedSelectedDay = format(selectedDay, 'Mddyy'); // Format selected day to 'Mddyy'

    // Find the matching outfit
    const matchingOutfit = outfitArr.find((outfit: Outfit) => outfit.date === formattedSelectedDay);

    if (matchingOutfit) {
      setOutfit(matchingOutfit); // Set the matching outfit to state
      console.log(outfit);
    } else {
      setOutfit(null); // No outfit for the selected day
    }
  };

  useEffect(() => {
    renderOutfit();
  }, [selectedDay, outfitArr]);

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
                      {/* Left arrow SVG */}
                    </button>
                    <button aria-label="calendar forward" onClick={nextMonth} className="ml-3 text-gray-800 hover:text-gray-400">
                      {/* Right arrow SVG */}
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
                  <OutfitCard userID={userID} outfit={outfit} clothes={cards}/>
                </div>
              ) : (
                <p>No outfit for this day.</p>
              )}
            </div>
          </div>
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
