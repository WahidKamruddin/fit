'use client'

import { useEffect, useState } from "react";
import { useUser } from "@/src/app/auth/auth";
import { db } from "@/src/app/firebaseConfig/clientApp";
import { doc, updateDoc } from "firebase/firestore";
import { add, eachDayOfInterval, endOfMonth, format, getDay, isEqual, isToday, parse, startOfMonth, startOfToday } from "date-fns";
import NotLoggedIn from "@/src/app/components/not-logged-in";
import OutfitCard from "@/src/app/components/outfit-card";
import { TiDelete } from "react-icons/ti";
import { IoMdAdd } from "react-icons/io";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCloset } from "@/src/app/providers/closetContext";

interface Outfit {
  id: string;
  Date: string;
  name?: string;
  description?: string;
}

export default function Calendar() {
  const user = useUser();
  const [outfit, setOutfit] = useState<Outfit | null>(null);
  const [fit, setFit] = useState<string | null>(null);

  const { cards, outfits } = useCloset();

  const [addButton, setAddButton] = useState(false);

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

  useEffect(() => {
    const formattedSelectedDay = format(selectedDay, 'MMddyy');
    const matchingOutfit = outfits.find((o) => o.Date === formattedSelectedDay) ?? null;
    setOutfit(matchingOutfit as Outfit | null);
  }, [selectedDay, outfits]);

  const handleOutfit = async (id: string) => {
    if (!user) return;
    await updateDoc(doc(db, `users/${user.uid}/outfits`, id), {
      Date: format(selectedDay, 'MMddyy'),
    });
    setAddButton(false);
  };

  if (!user) return <NotLoggedIn />;

  return (
    <div className="h-screen w-full pt-16 bg-off-white-100 text-black relative">
      <h1 className="mx-20 text-4xl">
        {user.displayName?.split(' ')[0]}'s Calendar
      </h1>

      <div className="px-12 mt-10 w-full flex justify-center gap-12">
        <div className="max-w-2xl w-4/6 shadow-lg rounded-xl">
          <div className="p-10 bg-white rounded-xl">
            <div className="px-4 flex items-center justify-between">
              <span className="text-base font-bold text-gray-800">
                {format(firstDayCurrentMonth, 'MMMM yyyy')}
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
              {days.map((day, dayIdx) => (
                <div
                  className={`${dayIdx === 0 && colStartClasses[getDay(day)]} py-2 flex justify-center items-center `}
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

        <div className="w-5/12 p-4 bg-white shadow-md rounded-xl">
          {outfit ? (
            <div>
              <h2>Outfit for {format(selectedDay, 'MMMM dd, yyyy')}</h2>
              <OutfitCard userID={user.uid} outfit={outfit} clothes={cards} deleteDate={true} />
            </div>
          ) : (
            <div className="relative h-full p-4 flex justify-center items-center">
              <p className="text-xl">No outfit for {format(selectedDay, 'MMMM dd, yyyy')}.</p>
              <button onClick={() => { setAddButton(true) }} className="absolute top-1 right-2 p-2 bg-mocha-150 rounded-3xl"><IoMdAdd className="text-2xl text-white" /></button>
            </div>
          )}
        </div>
      </div>

      {/* Add outfit modal */}
      {addButton && (
        <div className="absolute w-full h-full top-0 bg-black z-50 flex justify-center items-center bg-opacity-20">
          <div className="w-3/4 h-4/6 p-3 bg-white opacity-100 rounded-xl relative">
            <div className="h-4/6 flex justify-center">
              <div className="w-7/8 h-fit flex flex-wrap justify-center overflow-y-scroll ">
                {outfits.length > 0 ? (
                  outfits.map((something) => (
                    <div key={something.id}>
                      <button
                        className={fit === something.id ? "bg-indigo-400 text-white" : "bg-white"}
                        onClick={() => setFit(something.id)}
                      >
                        <OutfitCard userID={user.uid} outfit={something} clothes={cards} canEdit={false} deleteDate={true} />
                      </button>
                    </div>
                  ))
                ) : (
                  <p>No outfits found.</p>
                )}
              </div>
            </div>

            <button
              className="w-fit mt-6 p-2 px-3 bg-mocha-300 rounded-lg text-white hover:text-mocha-500 duration-300 disabled:cursor-not-allowed"
              onClick={() => fit && handleOutfit(fit)}
              disabled={!fit}
            >
              Fold away
            </button>

            <button onClick={() => { setAddButton(false) }} className="absolute top-0 right-0">
              <TiDelete className="text-3xl text-rose-600" />
            </button>
          </div>
        </div>
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
  'col-start-7',
];
