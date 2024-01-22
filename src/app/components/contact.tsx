import {AiFillInstagram, AiFillLinkedin, AiFillGithub} from "react-icons/ai";
import {BsBell} from "react-icons/bs";
import {TbLetterW,TbLetterK} from "react-icons/tb";


export default function Contact() {
    return(
        <div id="notif" className="h-screen bg-mocha-500 text-white">
            <h1 className="pt-16 text-4xl text-center">Get Notified</h1>
            <div className="text-xl flex flex-col items-center ">
                <h2 className="mt-16 text-center">Lose the pile of clothes on your bed. Sign up for FIT Beta.</h2>
                <button className="mt-10 text-lg py-2 px-4 bg-transparent text-white text-center rounded-xl border-2 border-white hover:border-mocha-100 hover:text-mocha-300 duration-500 flex items-center"><a href="https://forms.gle/fedR43dq635K6jdH7" target="_blank" rel="noreferrer" className="mr-2">Notify Me</a><BsBell/></button>
            </div>

            <h2 className="mt-32 text-xl text-center">More of me here:</h2>
            <div className="w-full mt-16 flex justify-center">
                <a href="https://www.linkedin.com/in/wahid-kamruddin-191248209/" target="_blank" rel="noreferrer"><AiFillLinkedin size={70} className="mx-4 rounded-xl hover:scale-110 hover:fill-mocha-100 duration-500"/></a>
                <div className="flex justify-center items-center"><a href="https://wahidkamruddin.netlify.app/" target="_blank" className="mx-4 py-4 px-4 bg-white flex rounded-3xl hover:scale-110 hover:bg-mocha-100 duration-500 " ><TbLetterW size={30} className="text-mocha-500"/><TbLetterK size={30} className="text-mocha-500"/></a></div>
                <a href="https://github.com/WahidKamruddin" target="_blank" rel="noreferrer"><AiFillGithub size={70} className="mx-4 hover:scale-110 hover:fill-mocha-100 duration-500"/></a>
            </div>
        </div>
    )
}