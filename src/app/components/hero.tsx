export default function Hero() {
    return (
        <div id="hero" className="h-screen bg-cover ">
            <h1 className="pt-20 text-center text-5xl sm:text-7xl text-white">Fashion, your way.</h1>
            <p className="mt-4 mx-4 sm:mx-0 text-lg sm:text-xl text-center font-light text-white">Explore new outfit combinations with FIT, your personal AI virtual closet.*</p>
            <p className="mt-2 text-center text-sm font-extralight text-white">{"*App is in development. We'll let you know when we're ready."}</p>

            <div className="w-full mt-10 flex justify-center">
                <button className="mx-2 py-2 px-3 bg-transparent text-lg text-white border-2 border-white rounded-md duration-1000 hover:text-yellow-900 hover:border-yellow-900 hover:duration-1000">Learn More</button>
            </div>
        </div>
      )
  }
  