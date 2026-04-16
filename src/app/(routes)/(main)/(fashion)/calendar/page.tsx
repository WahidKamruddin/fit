'use client'

import { useState } from "react";
import { useUser } from "@/src/app/auth/auth";
import { supabase } from "@/src/app/supabaseConfig/client";
import { add, eachDayOfInterval, endOfMonth, format, getDay, isEqual, isToday, parse, startOfMonth, startOfToday } from "date-fns";
import OutfitCard from "@/src/app/components/outfit-card";
import { IoMdAdd } from "react-icons/io";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCloset } from "@/src/app/providers/closetContext";
import PageSkeleton from "@/src/app/components/page-skeleton";
import { capitalize } from "@/src/app/lib/utils";

export default function Calendar() {
  const user = useUser();
  const { cards, outfits, addOutfitDate, removeOutfitDate } = useCloset();

  const [fit, setFit] = useState<string | null>(null);
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

  const formattedDay = format(selectedDay, 'MMddyy');
  const currentOutfit = outfits.find(o => o.Dates.includes(formattedDay)) ?? null;

  const handleOutfit = async (outfitId: string) => {
    if (!user) return;
    const outfit = outfits.find(o => o.id === outfitId);
    if (!outfit) return;
    const newDates = [...outfit.Dates, formattedDay];
    addOutfitDate(outfitId, formattedDay);
    setAddButton(false);
    setFit(null);
    await supabase.from('outfits').update({ dates: newDates }).eq('id', outfitId).eq('user_id', user.id);
  };

  const handleClearDate = async () => {
    if (!currentOutfit) return;
    const newDates = currentOutfit.Dates.filter(d => d !== formattedDay);
    removeOutfitDate(currentOutfit.id, formattedDay);
    await supabase.from('outfits').update({ dates: newDates }).eq('id', currentOutfit.id).eq('user_id', user.id);
  };

  if (!user) return <PageSkeleton />;

  const firstName = capitalize((user.user_metadata?.full_name ?? user.user_metadata?.name)?.split(' ')[0] ?? 'Your');

  return (
    <div className="min-h-screen w-full pt-16 bg-off-white-100">

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="px-4 sm:px-8 lg:px-20">
        <div className="pt-8">
          <div className="flex items-center gap-4 animate-fade-in" style={{ animationDelay: '0.05s' }}>
            <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">Schedule</span>
            <div className="w-8 h-px bg-mocha-300" />
            <span className="text-[10px] text-mocha-400 tracking-[0.5em] uppercase">
              {format(firstDayCurrentMonth, 'MMMM yyyy')}
            </span>
          </div>
          <h1
            className="mt-3 font-cormorant font-light text-mocha-500 leading-[0.95] animate-fade-in-up"
            style={{ fontSize: 'clamp(2.8rem, 5vw, 4.5rem)', animationDelay: '0.15s' }}
          >
            {firstName}{"'s"}<br />
            <span className="italic text-mocha-400">Calendar.</span>
          </h1>
          <div className="mt-6 h-px bg-mocha-200 animate-fade-in" style={{ animationDelay: '0.3s' }} />
        </div>
      </div>

      {/* ── Main layout ──────────────────────────────────────── */}
      <div className="px-4 sm:px-8 lg:px-12 mt-8 pb-16 flex flex-col lg:flex-row gap-6 lg:gap-8 animate-fade-in" style={{ animationDelay: '0.35s' }}>

        {/* Calendar widget */}
        <div className="w-full lg:max-w-xl bg-white rounded-2xl shadow-sm border border-mocha-200/60 p-6 sm:p-8">

          {/* Month nav */}
          <div className="flex items-center justify-between mb-8">
            <h2 className="font-cormorant text-2xl font-light text-mocha-500">
              {format(firstDayCurrentMonth, 'MMMM')}{' '}
              <span className="text-mocha-400">{format(firstDayCurrentMonth, 'yyyy')}</span>
            </h2>
            <div className="flex items-center gap-1">
              <button
                aria-label="previous month"
                onClick={prevMonth}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-mocha-200 text-mocha-400 hover:border-mocha-400 hover:text-mocha-500 transition-all duration-200"
              >
                <ArrowLeft size={14} />
              </button>
              <button
                aria-label="next month"
                onClick={nextMonth}
                className="w-8 h-8 flex items-center justify-center rounded-full border border-mocha-200 text-mocha-400 hover:border-mocha-400 hover:text-mocha-500 transition-all duration-200"
              >
                <ArrowRight size={14} />
              </button>
            </div>
          </div>

          {/* Day-of-week headers */}
          <div className="grid grid-cols-7 mb-3 text-center">
            {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
              <div key={d} className="text-[10px] tracking-[0.3em] uppercase text-mocha-300">{d}</div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7">
            {days.map((day, dayIdx) => (
              <div
                key={day.toString()}
                className={`${dayIdx === 0 ? colStartClasses[getDay(day)] : ''} py-1 flex justify-center`}
              >
                <button
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={[
                    'h-9 w-9 flex items-center justify-center rounded-full text-sm transition-all duration-200',
                    isEqual(day, selectedDay) && isToday(day)
                      ? 'bg-mocha-400 text-white font-semibold'
                      : isEqual(day, selectedDay)
                      ? 'bg-mocha-500 text-white font-semibold'
                      : isToday(day)
                      ? 'text-mocha-400 font-semibold hover:bg-mocha-100'
                      : 'text-mocha-500 hover:bg-mocha-100',
                  ].join(' ')}
                >
                  <time dateTime={format(day, 'MM-dd-yyyy')}>{format(day, 'd')}</time>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Day panel */}
        <div className="w-full lg:flex-1 bg-white rounded-2xl shadow-sm border border-mocha-200/60 p-6 sm:p-8">
          {currentOutfit ? (
            <div>
              <p className="text-[10px] tracking-[0.5em] uppercase text-mocha-400 mb-2">
                Outfit for
              </p>
              <p className="font-cormorant text-2xl font-light text-mocha-500 mb-6">
                {format(selectedDay, 'MMMM d, yyyy')}
              </p>
              <div className="h-px bg-mocha-200 mb-6" />
              <OutfitCard
                userID={user.id}
                outfit={currentOutfit}
                clothes={cards}
                onClearDate={handleClearDate}
              />
            </div>
          ) : (
            <div className="h-full min-h-48 flex flex-col justify-center items-center gap-5">
              <div className="text-center">
                <p className="text-[10px] tracking-[0.5em] uppercase text-mocha-300 mb-2">
                  {format(selectedDay, 'MMMM d, yyyy')}
                </p>
                <p className="font-cormorant text-2xl font-light text-mocha-400">
                  No outfit planned.
                </p>
              </div>
              <button
                onClick={() => setAddButton(true)}
                className="flex items-center gap-2 px-6 py-2.5 bg-mocha-500 text-mocha-100 text-[10px] tracking-[0.3em] uppercase rounded-full hover:bg-mocha-400 transition-all duration-300"
              >
                <IoMdAdd size={13} />
                Plan outfit
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
              onClick={() => { setAddButton(false); setFit(null); }}
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
                      <OutfitCard userID={user.id} outfit={something} clothes={cards} canEdit={false} />
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

// Indexed by getDay() (0 = Sun … 6 = Sat). Monday-first grid: Sun lives in col 7.
const colStartClasses = [
  'col-start-7', // Sunday
  'col-start-1', // Monday
  'col-start-2', // Tuesday
  'col-start-3', // Wednesday
  'col-start-4', // Thursday
  'col-start-5', // Friday
  'col-start-6', // Saturday
];
