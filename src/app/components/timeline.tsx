import {BiCloset} from "react-icons/bi";
import {PiTShirt} from "react-icons/pi";
import {AiOutlineShopping} from "react-icons/ai";
import {BsBell} from "react-icons/bs";


export default function Timeline() {
    return (
        <div>
            <div className="h-screen bg-mocha-400">
                <h1 className="pt-20 text-4xl text-center">Future Plans</h1>

                {/* Timeline CSS by Chris-Mingay! https://tailwindcomponents.com/component/responsive-vertical-timeline-1*/}


                <div className="bg-mocha-400 mt-20 flex flex-col justify-center">
                    <div className="py-3 sm:max-w-xl sm:mx-auto w-full px-2 sm:px-0">

                        <div className="relative text-gray-700 antialiased text-sm font-semibold">

                        {/* <!-- Vertical bar running through middle --> */}
                        <div className="hidden sm:block w-1 bg-off-white-100 absolute h-full left-1/2 transform -translate-x-1/2"></div>

                        {/* <!-- Left section, set by justify-start and sm:pr-8 --> */}
                        <div className="mt-6 sm:mt-0 sm:mb-12">
                            <div className="flex flex-col sm:flex-row items-center">
                                <div className="flex justify-start w-full mx-auto items-center">
                                    <div className="w-full sm:w-1/2 sm:pr-8">
                                    <div className="py-4 px-6 bg-mocha-100 text-white text-center rounded shadow">
                                        Digital Closet <br></br>(Expected Nov 2023)
                                    </div>
                                    </div>
                                </div>
                                <div className="rounded-full bg-mocha-400 border-white border-4 w-8 h-8 absolute left-1/2 -translate-y-4 sm:translate-y-0 transform -translate-x-1/2 flex items-center justify-center">
                                    <BiCloset color="white"/>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Right section, set by justify-end and sm:pl-8 --> */}
                        <div className="mt-6 sm:mt-0 sm:mb-12">
                            <div className="flex flex-col sm:flex-row items-center">
                                <div className="flex justify-end w-full mx-auto items-center">
                                    <div className="w-full sm:w-1/2 sm:pl-8">
                                    <div className="py-4 px-6 bg-mocha-100 text-white  text-center rounded shadow">
                                        AI Outfit Generator <br></br>(Expected Dec 2023)
                                    </div>
                                    </div>
                                </div>
                                <div className="rounded-full bg-mocha-400 border-white border-4 w-8 h-8 absolute left-1/2 -translate-y-4 sm:translate-y-0 transform -translate-x-1/2 flex items-center justify-center">
                                    <PiTShirt color="white"/>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Left section, set by justify-start and sm:pr-8 --> */}
                        <div className="mt-6 sm:mt-0 sm:mb-12">
                            <div className="flex flex-col sm:flex-row items-center">
                            <div className="flex justify-start w-full mx-auto items-center">
                                <div className="w-full sm:w-1/2 sm:pr-8">
                                <div className="py-4 px-6 bg-mocha-100 text-white text-center rounded shadow">
                                    E-commerce <br></br>(Expected March 2023)
                                </div>
                                </div>
                            </div>
                            <div className="rounded-full bg-mocha-400 border-white border-4 w-8 h-8 absolute left-1/2 -translate-y-4 sm:translate-y-0 transform -translate-x-1/2 flex items-center justify-center">
                                <AiOutlineShopping color="white"/>
                            </div>
                            </div>
                        </div>

                        {/* <!-- Right section, set by justify-end and sm:pl-8 --> */}
                        <div className="mt-6 sm:mt-0">
                            <div className="flex flex-col sm:flex-row items-center">
                            <div className="flex justify-end w-full mx-auto items-center">
                                <div className="w-full sm:w-1/2 sm:pl-8">
                                <div className="py-4 px-6 bg-mocha-100 text-white text-center rounded shadow">
                                    More to come ...
                                </div>
                                </div>
                            </div>
                            <div className="rounded-full bg-mocha-400 border-white border-4 w-8 h-8 absolute left-1/2 -translate-y-4 sm:translate-y-0 transform -translate-x-1/2 flex items-center justify-center">
                                <BsBell color="white"/>
                            </div>
                            </div>
                        </div>



                        </div>

                    </div>
                    </div>
            </div>

        </div>
    )
}