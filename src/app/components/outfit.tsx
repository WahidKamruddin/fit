"use client"
import Buttons from "./buttons";
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
        <div className="h-screen bg-off-white-100">
            <h1 className="ml-20 pt-16 text-4xl text-mocha-400 text-center">AI Outfits</h1>
            <div className="w-full mt-10 px-20 flex justify-evenly">
                <div className="w-4/12 h-64 text-mocha-400 text-center rounded-xl">
                    <h1>Choose from hundreds of different styles.</h1>
                    <h1 className="my-10 text-3xl">{style}. </h1>
                    <h1>Or wear what you're feeling.</h1>
                    <h1 className="my-10 text-3xl">{themes}.</h1>

                </div>
                <div className="w-3/12 h-64 bg-mocha-400 rounded-xl">I'm still workin on it bruh</div>
            </div>
            <div className="mt-10">
                <Buttons/>
            </div>
        </div>
    )
}