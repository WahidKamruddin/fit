'use client';
import Link from "next/link";
import { RadialChart } from "@/src/app/components/radial-chart";
import { useEffect, useState } from "react";
import { useUser } from "@/src/app/auth/auth";


export default function Page() {
  const user = useUser();
  const [userID, setUserID] = useState(null);

  useEffect(() => {
      // Set user ID if user is logged in
      if (user != null) {
        setUserID(user.uid);
      }
  
    }, [user, userID]);

  return (
    <div className="h-screen pt-16 px-8 bg-off-white-100">
      <div className="flex flex-1 flex-col">
        <div className="grid auto-rows-min gap-2 md:grid-cols-4">
          <div className="rounded-xl bg-white col-span-2 row-span-2 p-4 gap-4 flex flex-col">
            <h2 className="text-2xl">Daily Pick</h2>
            <h2 className="text-lg">Today is 30 F and cold. Wear something warm!</h2>
            <div className="h-full w-full flex gap-8">
              <div className="min-w-1/2 w-7/12 min-h-1/2 rounded-xl bg-gray-200 mb-2"></div>
              <div className="w-5/12 flex flex-col gap-4">
                <div className="text-md text-wrap">A simple yet classy look using your black coat, white shirt, and pleated black trousers. </div>
                <div className="flex flex-wrap gap-2">
                  <div className="bg-gray-200 py-1 px-2 rounded-xl hover:scale-105">Simple</div>
                  <div className="bg-gray-200 py-1 px-2 rounded-xl hover:scale-105">Classy</div>
                  <div className="bg-gray-200 py-1 px-2 rounded-xl hover:scale-105">Minimalistic</div>
                  <div className="bg-gray-200 py-1 px-2 rounded-xl hover:scale-105">Warm</div>
                </div>

                <div className="text-sm mt-12 italic">See how we tailor your outfits</div>
              </div>
              
            </div>
          </div>

          <div className="aspect-video rounded-xl bg-gray-200"></div>
          <div className="aspect-video rounded-xl bg-gray-200"></div>

          <div className="aspect-video rounded-xl bg-gray-200 shadow-md col-span-2 "></div>
          
          <div className="aspect-video row-span-2 col-span-2 rounded-xl bg-gray-200"></div>

        </div>  
      </div>
            
    </div>
  );
}

// <span className="text-lg bg-clip-text text-transparent gemeni bg-left hover:bg-right duration-500 ease-in-out">Generate with Gemeni</span>
