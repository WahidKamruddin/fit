"use client"
import Image from "next/image";


export default function Wardrobe() {
    return (
        <div className="h-screen min-w-full bg-off-white-100">
            <h1 className="ml-20 pt-16 text-3xl sm:text-4xl text-mocha-400">Digital Wardrobe.</h1>
            <div className="w-full mt-10 px-10 sm:px-20 sm:flex sm:justify-between">
                <div className="w-full sm:w-7/12 h-auto sm:h-fit py-3 sm:py-5 px-4 sm:px-6 rounded-2xl bg-mocha-400">
                    <Image alt="virtual closet" src="./img/virtualCloset.svg" className="rounded-xl" width={700} height={600}/>
                </div>

                <div className="w-full sm:w-4/12 h-4/12 p-8 sm:p-4 mr-10 mt-16 bg-mocha-400 rounded-2xl">
                    <div className="h-full text-center text-white font-normal text-lg sm:text-xl flex flex-col justify-center">
                        <p>Find your clothes instantly.</p>
                        <p className="mt-5">Skip the mess.</p>
                        <p className="mt-5">And the folding.</p>
                    </div>
                </div>
            </div>
        </div>
    )
}