import { BiCloset } from "react-icons/bi";
import { PiTShirt } from "react-icons/pi";
import { AiOutlineShopping } from "react-icons/ai";
import { BsBell } from "react-icons/bs";


export default function Timeline() {
    return (
        <div id="timeline" className="h-screen bg-off-white-100">
            <h1 className="pt-20 text-4xl text-center text-mocha-400">Future Plans</h1>

            {/* Timeline CSS by Chris-Mingay! https://tailwindcomponents.com/component/responsive-vertical-timeline-1*/}


            <div className="bg-off-white-100 mt-20 flex flex-col justify-center">
                <div className="py-3 sm:max-w-xl sm:mx-auto w-full px-2 sm:px-0">

                    <div className="relative text-gray-700 antialiased text-sm font-semibold">

                        {/* <!-- Vertical bar running through middle --> */}
                        <div className="hidden sm:block w-1 bg-mocha-400 absolute h-full left-1/2 transform -translate-x-1/2"></div>

                        {/* <!-- Left section, set by justify-start and sm:pr-8 --> */}
                        <div className="mt-6 sm:mt-0 sm:mb-12">
                            <div className="flex flex-col sm:flex-row items-center">
                                <div className="flex justify-start w-full mx-auto items-center">
                                    <div className="w-full sm:w-1/2 sm:pr-8">
                                        <div className="py-4 px-6 bg-mocha-400 text-white text-center rounded shadow">
                                            Digital Closet <br></br>(Expected Apr 2024)
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-full bg-mocha-400 border-mocha-400 border-4 text-lg w-8 h-8 absolute left-1/2 -translate-y-4 sm:translate-y-0 transform -translate-x-1/2 flex items-center justify-center">
                                    <BiCloset color="white"/>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Right section, set by justify-end and sm:pl-8 --> */}
                        <div className="mt-6 sm:mt-0 sm:mb-12">
                            <div className="flex flex-col sm:flex-row items-center">
                                <div className="flex justify-end w-full mx-auto items-center">
                                    <div className="w-full sm:w-1/2 sm:pl-8">
                                        <div className="py-4 px-6 bg-mocha-400 text-white  text-center rounded shadow">
                                            AI Outfit Generator <br></br>(Expected Jun 2024)
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-full bg-off-white-100 border-mocha-400 text-mocha-400 text-lg border-2 w-8 h-8 absolute left-1/2 -translate-y-4 sm:translate-y-0 transform -translate-x-1/2 flex items-center justify-center">
                                    <PiTShirt/>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Left section, set by justify-start and sm:pr-8 --> */}
                        <div className="mt-6 sm:mt-0 sm:mb-12">
                            <div className="flex flex-col sm:flex-row items-center">
                                <div className="flex justify-start w-full mx-auto items-center">
                                    <div className="w-full sm:w-1/2 sm:pr-8">
                                        <div className="py-4 px-6 bg-mocha-400 text-white text-center rounded shadow">
                                            E-commerce <br></br>(Expected Sept 2024)
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-full bg-off-white-100 border-mocha-400 border-2 text-mocha-400 text-lg w-8 h-8 absolute left-1/2 -translate-y-4 sm:translate-y-0 transform -translate-x-1/2 flex items-center justify-center">
                                    <AiOutlineShopping/>
                                </div>
                            </div>
                        </div>

                        {/* <!-- Right section, set by justify-end and sm:pl-8 --> */}
                        <div className="mt-6 sm:mt-0">
                            <div className="flex flex-col sm:flex-row items-center">
                                <div className="flex justify-end w-full mx-auto items-center">
                                    <div className="w-full sm:w-1/2 sm:pl-8">
                                        <div className="py-4 px-6 bg-mocha-400 text-white text-center rounded shadow">
                                            More to come ...
                                        </div>
                                    </div>
                                </div>
                                <div className="rounded-full bg-off-white-100 border-mocha-400 border-2 text-lg w-8 h-8 text-mocha-400 absolute left-1/2 -translate-y-4 sm:translate-y-0 transform -translate-x-1/2 flex items-center justify-center">
                                    <BsBell/>
                                </div>
                            </div>
                        </div>



                    </div>

                </div>
            </div>
        </div>

    )
}