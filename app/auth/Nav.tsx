import Link from "next/link"
import Login from "./Login"
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../pages/api/auth/[...nextauth]";

export default async function Nav(){
    const session = await getServerSession(authOptions)
    console.log(session)
    return (
      <nav className="flex justify-between items-center py-8">
        <Link href={"/"}>
          <img className="font-bold text-lg" src={"rocket.png"} width={130}/>
        </Link>
        {/* Client component 👇 */}
        <ul className="flex items-center gap-6">
          <Login />
        </ul>
      </nav>
    );
}