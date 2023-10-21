"use client"

import Buttons from "./buttons";

export default function Wardrobe() {
    return (
        <div className="h-screen bg-off-white-100">
            <h1 className="ml-20 pt-16 text-4xl text-mocha-400">Digital Wardrobe.</h1>
            <div className="w-full mt-10 px-20 flex justify-between">
                <div className="w-7/12 h-fit py-5 px-6 rounded-2xl bg-mocha-400">
                    <img src="./img/virtualCloset.svg" className="rounded-xl"/>
                </div>

                <div className="w-4/12 h-1/2 p-4 mr-10 mt-16 bg-mocha-400 rounded-2xl">
                    <div className="text-center font-normal text-xl leading-loose">
                        <p className="mt-16">Find your clothes instantly.</p>
                        <p className="mt-5">Skip the mess.</p>
                        <p className="mt-5 pb-16">And the folding.</p>
                    </div>
                </div>
            </div>
            <div className="mt-10">
                <Buttons/>
            </div>
        </div>
    )
}