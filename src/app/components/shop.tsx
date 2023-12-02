export default function Shop() {
    return (
        <div className="h-screen min-w-full bg-off-white-100">
            <h1 className="mr-20 pt-16 text-4xl text-mocha-400 text-end">Shop Essentials.</h1>
            <div className="h-1/2 mt-20 text-black flex justify-center">
                <div className="mx-4"><img src="img/buyJacket.svg" width={325}/></div>
                <div className="mx-4"><img src="img/buyShirt.svg" width={325}/></div>
                <div className="mx-4"><img src="img/buyTurtleneck.svg" width={325}/></div>
            </div>
            <div className="mt-10 flex justify-center">
                <h1 className="text-3xl text-mocha-400">Buy what you need. When you need.</h1>
            </div>
        </div>
    )
}