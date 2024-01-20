import Link from "next/link"
import Login from "./Login"
import Logged from "./Logged";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export default async function Nav(){
    const session = await getServerSession(authOptions)
    return (
      <nav className="flex justify-between items-center py-8">
        <Link className="flex items-center" href={"/"}>
          <img className="font-bold text-lg" src={"rocket.png"} width={130} />
          <h1 className="text-4xl font-bold text-white">Share It</h1>
        </Link>
        {/* Client component 👇 */}
        <ul className="flex items-center gap-6">
          {!session?.user && <Login />}
          {session?.user && session.user.image && (
            <Logged image={session.user.image} />
          )}
        </ul>
      </nav>
    );
}