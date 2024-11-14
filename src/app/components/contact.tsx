import {AiOutlineInstagram, AiFillInstagram, AiFillLinkedin, AiFillGithub} from "react-icons/ai";

const Contact = () => {
    return (
        <div className="h-screen bg-mocha-300">
            <svg width="0" height="0">
                <linearGradient id="instagram" x1="100%" y1="100%" x2="0%" y2="0%">
                    <stop stop-color="#f09433" offset="0%" />
                    <stop stop-color="#e6683c" offset="25%" />
                    <stop stop-color="#dc2743" offset="50%" />
                    <stop stop-color="#cc2366" offset="75%" />
                    <stop stop-color="#bc1888" offset="100%" />
                </linearGradient>
            </svg>

            <div className="p-28">
                <h1 className="mt-24 text-7xl text-mocha-500">Keep in touch</h1>
                <div className="w-full h-3/4 my-36 flex justify-center items-center">
                    <a href="https://www.linkedin.com/in/wahid-kamruddin/" target="_blank" rel="noreferrer"><AiFillLinkedin size={150} className="mx-8 rounded-2xl fill-mocha-500 hover:scale-110 hover:fill-sky-600 duration-500"/></a>
                    <a href="https://www.instagram.com/wahidkamruddin/" target="_blank" rel="noreferrer"><AiFillInstagram size={150} className="mx-8 fill-mocha-500 hover:fill-[url(#instagram)] hover:scale-110 duration-500"/></a>
                    <a href="https://github.com/WahidKamruddin" target="_blank" rel="noreferrer"><AiFillGithub size={150} className="mx-8 fill-mocha-500 hover:scale-110 hover:fill-obsidian-100 duration-500"/></a>
                </div>
            </div>
        </div>
    );
}
 
export default Contact;