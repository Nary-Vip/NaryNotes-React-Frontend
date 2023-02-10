import { Dispatch, SetStateAction } from "react";

export interface User{
    access_token: string,
    setToken: Dispatch<SetStateAction<string>>,
    isLoggedIn?: boolean,
    loginOrSignup?: string,
    email?: string,
    setIsLoggedIn?: Dispatch<SetStateAction<boolean>>,
    setLoginOrSignup?: Dispatch<SetStateAction<string>>,
    firstName?: string,
    setFirstName?: Dispatch<SetStateAction<string>>,
    lastName?: string,
    setLastName?: Dispatch<SetStateAction<string>>,
    mobileNumber?: string,
    setMobileNumber?: Dispatch<SetStateAction<string>>,
    emailId?: string,
    setEmail?: Dispatch<SetStateAction<string>>,
    age?: string,
    setAge?: Dispatch<SetStateAction<string>>,
    country?: string,
    setCountry?: Dispatch<SetStateAction<string>>,
    state?: string,
    setState?: Dispatch<SetStateAction<string>>,
    roles?: string,
    setRoles?: Dispatch<SetStateAction<string>>,
    profileUpdated?: string,
    setProfileUpdated?: Dispatch<SetStateAction<string>>,
    notes?: Array<Note>,
    setNotes?: Dispatch<SetStateAction<Array<Note> | undefined>>,
    transcribedText : string|null,
    setTranscribedText : Dispatch<SetStateAction<string|null>>
}

export interface Note{
    color?: string,
    _id?: string,
    userId?: string,
    title?: string, 
    content?: string,
    tags?: Array<String>,
    createdAt?: String,
    updatedAt?: String,
};