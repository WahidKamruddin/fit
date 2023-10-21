import {BiSolidLeftArrow, BiSolidRightArrow} from "react-icons/bi";
import { useState } from "react";


export default function Buttons() {
    const [buttonState1, setButtonState1] = useState(true);
    const [buttonState2, setButtonState2] = useState(false);
    const [buttonState3, setButtonState3] = useState(false);

    function handleClick1() {
        setButtonState1(true);
        setButtonState2(false);
        setButtonState3(false);
    }

    function handleClick2() {
        setButtonState1(false);
        setButtonState2(true);
        setButtonState3(false);
    }

    function handleClick3() {
        setButtonState1(false);
        setButtonState2(false);
        setButtonState3(true);
    }

    let toggleClass1 = buttonState1 ? ' active' : '';
    let toggleClass2 = buttonState2 ? ' active' : '';
    let toggleClass3 = buttonState3 ? ' active' : '';
    
    return (
        <div className="flex justify-center">
            <BiSolidLeftArrow className="mt-3 mr-7 cursor-pointer text-mocha-400 duration-700 hover:text-mocha-500 hover:duration-700"/>
            <div className="w-2/12 h-10 bg-mocha-300 rounded-3xl flex justify-center items-center">
                <button onClick={handleClick1} className={`btn${toggleClass1} w-2.5 h-2.5 ml-3 mr-4 bg-off-white-100 rounded-3xl cursor-pointer hover:bg-mocha-500 duration-700 hover:duration-700`}></button>
                <button onClick={handleClick2} className={`btn${toggleClass2} w-2.5 h-2.5 mx-4 bg-off-white-100 rounded-3xl cursor-pointer hover:bg-mocha-500 duration-700 hover:duration-700`}></button>
                <button onClick={handleClick3} className={`btn${toggleClass3} w-2.5 h-2.5 ml-4 mr-3 bg-off-white-100 rounded-3xl cursor-pointer hover:bg-mocha-500 duration-700 hover:duration-700`}></button>
            </div>
            <BiSolidRightArrow className="mt-3 ml-7 cursor-pointer text-mocha-400 duration-700 hover:text-mocha-500 hover:duration-700"/>
        </div>

    )
}