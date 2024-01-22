import { onAuthStateChanged, signInWithPopup, signOut } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../firebaseConfig/clientApp";

//Sign in with Google
export async function googleSignIn(e:any){
        const provider =  new GoogleAuthProvider();
        return signInWithPopup(auth, provider);    
} 

//Log out
export async function logOut(){
        signOut(auth);
}

//user
export function useUser() {
    const [user, setUser] = useState<any | null>(null);

    useEffect(() => {
        return onAuthStateChanged(auth, (currentUser) => { setUser(currentUser); });
    },[]);

    return user;
}
