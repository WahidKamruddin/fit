'use client'

import { useEffect, useState } from "react";
import { useUser } from "@/src/app/auth/auth";
import { supabase } from "@/src/app/supabaseConfig/client";
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
    await supabase.from('outfits').update({ date: format(selectedDay, 'MMddyy') }).eq('id', id);
    setAddButton(false);
  };

  if (!user) return <NotLoggedIn />;

  return (
    <div className="min-h-screen w-full pt-16 bg-off-white-100 text-black">
      <h1 className="px-4 sm:px-8 lg:px-20 text-3xl sm:text-4xl">
        {(user.user_metadata?.full_name ?? user.user_metadata?.name)?.split(' ')[0]}{"'s"} Calendar
      </h1>

      <div className="px-4 sm:px-8 lg:px-12 mt-8 pb-12 flex flex-col lg:flex-row gap-6 lg:gap-10">

        {/* Calendar */}
        <div className="w-full lg:max-w-2xl shadow-lg rounded-2xl">
          <div className="p-6 sm:p-10 bg-white rounded-2xl">
            <div className="px-2 flex items-center justify-between mb-8">
              <span className="text-base font-bold text-gray-800">
                {format(firstDayCurrentMonth, 'MMMM yyyy')}
              </span>
              <div className="flex items-center gap-3">
                <button aria-label="calendar backward" onClick={prevMonth} className="text-gray-800 hover:text-gray-400">
                  <ArrowLeft size={18} />
                </button>
                <button aria-label="calendar forward" onClick={nextMonth} className="text-gray-800 hover:text-gray-400">
                  <ArrowRight size={18} />
                </button>
              </div>
            </div>
            <div className="grid grid-cols-7 mb-2 text-sm leading-6 text-center text-gray-500">
              <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div>
              <div>Fri</div><div>Sat</div><div>Sun</div>
            </div>
            <div className="grid grid-cols-7 mt-2 text-sm text-black">
              {days.map((day, dayIdx) => (
                <div
                  className={`${dayIdx === 0 && colStartClasses[getDay(day)]} py-1 flex justify-center items-center`}
                  key={day.toString()}
                >
                  <button
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`
                      h-9 w-9 text-center rounded-full
                      ${!isEqual(day, selectedDay) && 'hover:bg-gray-200 ease-in'}
                      ${isToday(day) && !isEqual(day, selectedDay) && 'text-mocha-400 font-semibold'}
                      ${isToday(day) && isEqual(day, selectedDay) && 'bg-mocha-400 text-white font-semibold'}
                      ${isEqual(day, selectedDay) && !isToday(day) && 'bg-mocha-500 text-white font-semibold'}
                    `}
                  >
                    <time dateTime={format(day, 'MM-dd-yyyy')}>{format(day, 'd')}</time>
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Day panel */}
        <div className="w-full lg:flex-1 bg-white shadow-md rounded-2xl p-6">
          {outfit ? (
            <div>
              <p className="text-[10px] tracking-[0.4em] uppercase text-mocha-400 mb-4">
                {format(selectedDay, 'MMMM dd, yyyy')}
              </p>
              <OutfitCard userID={user.id} outfit={outfit} clothes={cards} deleteDate={true} />
            </div>
          ) : (
            <div className="h-full min-h-40 flex flex-col justify-center items-center gap-4">
              <p className="text-[10px] tracking-[0.4em] uppercase text-mocha-300 text-center">
                No outfit — {format(selectedDay, 'MMMM dd, yyyy')}
              </p>
              <button
                onClick={() => setAddButton(true)}
                className="flex items-center gap-2 px-5 py-2.5 border border-mocha-300 text-mocha-500 text-[10px] tracking-[0.3em] uppercase rounded-full hover:bg-mocha-500 hover:text-mocha-100 hover:border-mocha-500 transition-all duration-300"
              >
                <IoMdAdd size={14} /> Add outfit
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Add outfit modal */}
      {addButton && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex justify-center items-center p-4">
          <div className="relative w-full max-w-2xl bg-off-white-100 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col gap-6">

            <button
              onClick={() => setAddButton(false)}
              className="absolute top-5 right-5 w-8 h-8 flex items-center justify-center rounded-full border border-mocha-200 text-mocha-400 hover:border-mocha-400 hover:text-mocha-500 transition-all duration-200"
              aria-label="Close"
            >
              <span className="text-xs leading-none">✕</span>
            </button>

            <div>
              <p className="text-[10px] tracking-[0.5em] uppercase text-mocha-400 mb-2">
                {format(selectedDay, 'MMMM dd, yyyy')}
              </p>
              <h2 className="font-cormorant text-4xl font-light text-mocha-500">
                Pick an <span className="italic text-mocha-400">outfit.</span>
              </h2>
            </div>

            <div className="h-64 sm:h-80 overflow-y-auto rounded-2xl border border-mocha-200">
              {outfits.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-3 p-4">
                  {outfits.map((something) => (
                    <button
                      key={something.id}
                      onClick={() => setFit(something.id)}
                      className={`rounded-2xl border-2 transition-all duration-200 ${fit === something.id ? 'border-mocha-500 scale-105' : 'border-transparent'}`}
                    >
                      <OutfitCard userID={user.id} outfit={something} clothes={cards} canEdit={false} deleteDate={true} />
                    </button>
                  ))}
                </div>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-[10px] tracking-[0.4em] uppercase text-mocha-300">No outfits found</p>
                </div>
              )}
            </div>

            <button
              onClick={() => fit && handleOutfit(fit)}
              disabled={!fit}
              className="w-full py-3.5 bg-mocha-500 text-mocha-100 text-[11px] tracking-[0.3em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Assign to Day
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
