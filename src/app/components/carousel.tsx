'use client'

import Outfits from "./ai-outfit-feature";
import Wardrobe from "./wardrobe";
import Shop from "./shop";

import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { useState } from "react";

const pages = [<Wardrobe key="wardrobe" />, <Outfits key="outfits" />, <Shop key="shop" />];

export default function Carousel() {
    const [active, setActive] = useState(0);

    const prev = () => setActive((i) => Math.max(i - 1, 0));
    const next = () => setActive((i) => Math.min(i + 1, pages.length - 1));

    return (
        <div id="about" className="h-screen relative">
            <div className="relative flex overflow-hidden">
                {pages.map((page, i) => (
                    <div
                        key={i}
                        className={`min-w-full duration-700 ${i !== active ? 'translate-x-full absolute' : ''}`}
                    >
                        {page}
                    </div>
                ))}
            </div>
            <div className="absolute w-full bottom-6">
                <div className="flex justify-center">
                    <BiSolidLeftArrow
                        onClick={prev}
                        className={`mt-3 mr-7 text-mocha-400 duration-700 hover:text-mocha-500 hover:duration-700 ${active === 0 ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                    />
                    <div className="w-2/12 h-10 bg-mocha-300 rounded-3xl flex justify-center items-center">
                        {pages.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActive(i)}
                                className={`w-2.5 h-2.5 mx-4 rounded-3xl cursor-pointer duration-700 hover:duration-700 ${active === i ? 'bg-mocha-500' : 'bg-off-white-100 hover:bg-mocha-500'}`}
                            />
                        ))}
                    </div>
                    <BiSolidRightArrow
                        onClick={next}
                        className={`mt-3 ml-7 text-mocha-400 duration-700 hover:text-mocha-500 hover:duration-700 ${active === pages.length - 1 ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                    />
                </div>
            </div>
        </div>
    );
}
