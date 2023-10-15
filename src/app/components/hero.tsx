export default function Hero() {
    return (
        <div>
            <h1 className="mt-10 text-center text-7xl font-normal">Fashion, your way.</h1>
            <p className="mt-4 text-center text-xl font-light">Explore new outfit combinations with FIT, AI virtual closet.*</p>
            <p className="mt-2 text-center text-sm font-extralight">*App is in development</p>

            <div className="w-full mt-6 flex justify-center">
                <button className="mx-2 py-2 px-3 bg-orange-100 border-2 border-black rounded-3xl" >Get Started</button>
            </div>

            <div className="w-full mt-20 flex justify-evenly">
                <img src="./img/jacket.png" className="w-48 h-auto"/> 
                <img src="./img/jacket.png" className="w-48 h-auto"/> 
                <img src="./img/jacket.png" className="w-48 h-auto"/> 
            </div>

            <div>
                <p className="w-10/12 text-end mt-2 text-xs font-extralight">Uniqlo Jacket</p>
            </div>
        </div>
      )
  }
  