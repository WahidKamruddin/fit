"use client"
import { setTimeout } from "timers/promises";
import { useTypewriter } from "react-simple-typewriter";

export default function Outfits() {

    const [style] = useTypewriter({
        words: ["Minimal", "Casual", "Goth", "Formal", "Soft", "Old Money"],
        loop: true,
        typeSpeed: 120,
        deleteSpeed: 90,
    });

    const [themes] = useTypewriter({
        words: ["Sporty", "Smart", "Cheery", "Cozy", "Techy", "Retro"],
        loop: true,
        typeSpeed: 120,
        deleteSpeed: 90,
    });

    


    return (
        <div className="h-screen min-w-full bg-off-white-100">
            <h1 className="ml-20 pt-16 text-4xl text-mocha-400 text-center">AI Outfits.</h1>
            <div className="w-full mt-24 pl-16 pr-20 flex justify-evenly items-center">
                <div className="w-4/12 h-64 text-mocha-400 text-center rounded-xl">
                    <h1>Choose from hundreds of different styles.</h1>
                    <h1 className="my-10 text-3xl">{style}. </h1>
                    <h1>{"Or wear what you're feeling."}</h1>
                    <h1 className="my-10 text-3xl">{themes}.</h1>
                </div>

                <div className="w-5/12 p-6 bg-mocha-400 rounded-xl">
                    <div className="w-full py-4 bg-off-white-100 rounded-xl flex justify-evenly">
                        <img src="./img/fit1.svg" className="w-5/12"/>
                        <img src="./img/fit2.svg" className="w-5/12"/>
                    </div>
                </div>  
            </div>

        </div>
    )
}