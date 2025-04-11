import Link from "next/link"


export default function Page() {
  return (

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <div className="grid auto-rows-min gap-4 md:grid-cols-3">
            <Link href="/closet" className="aspect-video rounded-xl bg-muted/50">Closet</Link>
            <Link href="/outfits" className="aspect-video rounded-xl bg-muted/50">Outfit</Link>
            <Link href="/calendar" className="aspect-video rounded-xl bg-muted/50">Calendar</Link>
            <span className="text-lg bg-clip-text text-transparent gemeni bg-left hover:bg-right duration-500 ease-in-out">Generate with Gemeni</span>
          </div>
          <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
        </div>
  )
}
