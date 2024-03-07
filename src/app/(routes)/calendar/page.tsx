'use client'
import { useEffect, useState } from "react";
import { useUser } from "../../auth/auth";
import { db, storage } from "../../firebaseConfig/clientApp";
import { addDoc, collection, onSnapshot, query} from "firebase/firestore";

import notLoggedIn from "../../components/notLoggedIn";

import Link from "next/link";
import { add, eachDayOfInterval, endOfMonth, format, getDate, getDay, isEqual, isToday, parse, startOfMonth, startOfToday } from "date-fns";
import { FirebaseError } from "firebase/app";
import { Firestore } from "firebase/firestore";

export default function Closet() {
  //Define User
  const user = useUser();
  const [userID, setUserID] = useState(null);

  const [outfitArr, setOutfitArr] = useState([]);
  const [outfit, setOutfit] = useState<any | null>(null);
  
  useEffect(() => {
    if (user != null) {
      setUserID(user.uid);
    }

    //fetches user data
    const q = query(collection(db, `users/${userID}/calendar`));

    const data = onSnapshot(q, (QuerySnapshot:any) => {
      let itemsArr :any = [];

      QuerySnapshot.forEach((doc:any) => {
        itemsArr.push({...doc.data(), id: doc.id});
      });

      setOutfitArr(itemsArr);
    })

  }, [user,userID]);

  let today = startOfToday();

  const [selectedDay, setselectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format (today, 'MMM-yyyy'))
  let firstDayCurrentMonth = parse(currentMonth, 'MMM-yyyy', new Date() )

  let days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth)
  })

  const nextMonth = () => {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 })
    setCurrentMonth (format (firstDayNextMonth, 'MMM-yyyy'))
  }

  const prevMonth = () => {
    let firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 })
    setCurrentMonth (format (firstDayNextMonth, 'MMM-yyyy'))
  }

//   const renderOutfit = () => {

//     for (let i = 0; i < outfitArr.length; i++) {
//       if (format(selectedDay, 'MMMM dd yyyy') == outfitArr[i].time){
//         setOutfit(outfitArr[i]);
//         return true;
//       }
//     } 

//     setOutfit(null);
//     return false;
// }



  return (
    <div>
      {user?
      <div className="h-screen pt-16 bg-off-white-100 text-black relative"> 
          <h1 className="mx-20 text-4xl">{user.displayName.split(' ')[0]}'s Calendar</h1>  

          <div className="px-20 mr-20 mt-10 w-full flex justify-between">

            <div className="max-w-2xl w-4/6 shadow-lg rounded-xl">
                <div className=" p-10 bg-white rounded-xl">
                    <div className="px-4 flex items-center justify-between">
                        <span className="focus:outline-none  text-base font-bold text-gray-800"> {format(currentMonth, 'MMMM yyyy')}</span>
                        <div className="flex items-center">
                            <button aria-label="calendar backward" onClick={prevMonth} className="focus:text-gray-400 hover:text-gray-400 text-gray-800">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-left" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <polyline points="15 6 9 12 15 18" />
                            </svg>
                        </button>
                        <button aria-label="calendar forward" onClick={nextMonth} className="focus:text-gray-400 hover:text-gray-400 ml-3 text-gray-800"> 
                              <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler  icon-tabler-chevron-right" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                <polyline points="9 6 15 12 9 18" />
                            </svg>
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
                      {days.map((day:any, dayIdx:any) => (
                        <div 
                          className={`
                          ${dayIdx === 0 && colStartClasses[getDay(day)]}
                          py-2 flex justify-center items-center`
                        }
                          key={day.toString()}>

                          <button
                          type="button"
                          onClick={() => setselectedDay(day)}
                          className={`
                            h-10 w-10 text-center rounded-full text-black 
                            ${!isEqual(day, selectedDay) && 'hover:bg-gray-200 ease-in' }
                            ${isToday(day) && !isEqual(day, selectedDay) && 'text-indigo-400 font-semibold'}
                            ${isToday(day) && isEqual(day, selectedDay) && 'bg-indigo-400 text-white font-semibold'}
                            ${isEqual(day, selectedDay) && 'bg-black text-white font-semibold'}
                          `}
                          >
                            <time dateTime={format(day, 'MM-dd-yyyy')}>{format(day, 'd')}</time>
                          </button>
                        </div>
                     ))}
                    </div>
                </div>
                
            </div>

            <div className="w-5/12 p-4 bg-gray-400 rounded-xl">
              {!selectedDay?
                outfit : 
                <p>{format(selectedDay, 'MMMM dd yyyy')}</p>
                
              }


            </div>
          </div>
          
      </div> :      
        notLoggedIn()
      }
    </div>
  )
}


let colStartClasses = [
  'col-start-0',
  'col-start-1',
  'col-start-2',
  'col-start-3',
  'col-start-4',
  'col-start-5',
  'col-start-6',
  'col-start-7'
]
 