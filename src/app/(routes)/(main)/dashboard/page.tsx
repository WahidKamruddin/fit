import Link from "next/link";
import { RadialChart } from "@/src/app/components/radialChart";

export default function Page() {
  return (
    <div className="h-screen pt-20 flex flex-1 flex-col gap-4 p-4 bg-off-white-100">
      <div className="grid auto-rows-min gap-4 md:grid-cols-3">
        <div className="aspect-video rounded-xl bg-gray-200" />
        <div className="aspect-video rounded-xl bg-gray-200" />
        <div className="rounded-xl bg-gray-200 row-span-2"><RadialChart/></div>        
        <div className="aspect-video rounded-xl bg-gray-200" />
        <div className="aspect-video rounded-xl bg-gray-200" />
      </div>

      <div className="min-h-[100vh] flex-1 rounded-xl bg-gray-200 md:min-h-min"/>
        
    </div>
  );
}

// <span className="text-lg bg-clip-text text-transparent gemeni bg-left hover:bg-right duration-500 ease-in-out">Generate with Gemeni</span>
