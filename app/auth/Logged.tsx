"use client"

import Image from "next/image"
import { signOut } from "next-auth/react"
import Link from "next/link";

type User =  {
    image : string
}
export default function Logged({image}:User){
    return (
      <li className="list-none flex items-center gap-4">
        <button
          className=" text-sm bg-gray-700 py-2 px-4 rounded-xl disabled:opacity-25"
          onClick={() => signOut()}
        >
          Sign Out
        </button>
        <Link href={'/dashboard'}>
            <Image width={64} height={64} className="w-14 rounded-full" src={image} alt={"image"} />
        </Link>
      </li>
    );
}