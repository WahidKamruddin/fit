import Link from "next/link"

export default function noUser() {
    return (
        <div>
            <h1>Please log in to access this page!</h1>
            <Link href="/login"><button className="bg-red-300 mx-auto p-10 border-4">Sign up / Login</button></Link>
        </div>
    )
}