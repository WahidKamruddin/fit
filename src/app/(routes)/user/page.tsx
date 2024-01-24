'use client'

import { redirect } from "next/navigation";
import { useUser } from "../../auth/auth";


export default function User() {
    const user = useUser();

    
    return(
        <div className="h-screen pt-16 text-black">
            {user? 
            <div>
                <h1 className="text-center">asd</h1>
            </div>
            :
            <div>
                sign in
            </div>
        }
        </div>
    )
}