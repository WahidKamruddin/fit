export default function Hero() {
    return (
        <div>
            <h1 className="mt-10 text-center text-5xl font-normal">Fashion, your way.</h1>
            <p className="mt-2 text-center text-md font-light">Explore new outfit possibilities with AI, all from your virtual closet.</p>
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
  