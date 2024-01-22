import Link from "next/link";

export default function notLoggedIn() {
    return (
        <div className="flex items-center justify-center h-screen">
      <div className="bg-white p-8 rounded shadow-md">
        <h2 className="text-2xl font-semibold mb-6 text-center">Oops, You're Not Logged In</h2>
        <p className="text-gray-600 text-center"> It seems like you are not logged in. Please log in to access this page.</p>
        <Link href='/login' className="flex justify-center"><button className="mt-8 bg-blue-500 text-white rounded py-2 px-4 hover:bg-blue-600">Login</button></Link>
      </div>
    </div>
    )
}