'use client'

import { useEffect, useState } from "react";
import { useUser } from "@/src/app/auth/auth";
import { supabase } from "@/src/app/supabaseConfig/client";
import { add, eachDayOfInterval, endOfMonth, format, getDay, isEqual, isToday, parse, startOfMonth, startOfToday } from "date-fns";
import OutfitCard from "@/src/app/components/outfit-card";
import { IoMdAdd } from "react-icons/io";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useCloset } from "@/src/app/providers/closetContext";
import PageSkeleton from "@/src/app/components/page-skeleton";

interface CalendarEntry {
  id: string;
  outfit_id: string;
  date: string;
}

export default function Calendar() {
  const user = useUser();
  const { cards, outfits } = useCloset();

  const [calendarEntries, setCalendarEntries] = useState<CalendarEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<CalendarEntry | null>(null);
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

  // Fetch calendar entries + realtime
  useEffect(() => {
    if (!user) return;

    const fetchEntries = async () => {
      const { data } = await supabase
        .from('calendar_entries')
        .select('id, outfit_id, date')
        .eq('user_id', user.id);
      if (data) setCalendarEntries(data);
    };

    fetchEntries();

    const channel = supabase
      .channel(`calendar-${user.id}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'calendar_entries', filter: `user_id=eq.${user.id}` }, fetchEntries)
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user?.id]); // eslint-disable-line react-hooks/exhaustive-deps

  // Resolve the entry for the selected day
  useEffect(() => {
    const formattedDay = format(selectedDay, 'MMddyy');
    setCurrentEntry(calendarEntries.find(e => e.date === formattedDay) ?? null);
  }, [selectedDay, calendarEntries]);

  const handleOutfit = async (outfitId: string) => {
    if (!user) return;
    const date = format(selectedDay, 'MMddyy');
    const tempId = crypto.randomUUID();
    setCalendarEntries(prev => [...prev, { id: tempId, outfit_id: outfitId, date }]);
    setAddButton(false);

    const { data } = await supabase.from('calendar_entries').insert({
      user_id: user.id,
      outfit_id: outfitId,
      date,
    }).select('id, outfit_id, date').single();

    if (data) {
      setCalendarEntries(prev => prev.map(e => e.id === tempId ? data : e));
    }
  };

  const handleClearDate = async () => {
    if (!currentEntry) return;
    const entryId = currentEntry.id;
    setCalendarEntries(prev => prev.filter(e => e.id !== entryId));
    await supabase.from('calendar_entries').delete().eq('id', entryId);
  };

  if (!user) return <PageSkeleton />;

  const firstName = (user.user_metadata?.full_name ?? user.user_metadata?.name)?.split(' ')[0] ?? 'Your';

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
          {currentEntry ? (
            <div>
              <p className="text-[10px] tracking-[0.5em] uppercase text-mocha-400 mb-2">
                Outfit for
              </p>
              <p className="font-cormorant text-2xl font-light text-mocha-500 mb-6">
                {format(selectedDay, 'MMMM d, yyyy')}
              </p>
              <div className="h-px bg-mocha-200 mb-6" />
              {outfits.find(o => o.id === currentEntry.outfit_id) && (
                <OutfitCard
                  userID={user.id}
                  outfit={outfits.find(o => o.id === currentEntry.outfit_id)!}
                  clothes={cards}
                  onClearDate={handleClearDate}
                />
              )}
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
