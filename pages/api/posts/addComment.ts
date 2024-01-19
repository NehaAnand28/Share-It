import prisma from "../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    console.log("in  method " + req.method);
    const session = await getServerSession(req, res, authOptions);
    console.log("in add comment session", session);
    if (!session) {
      console.log("error in getting session");
      return res
        .status(401)
        .json({ message: "Please signin to add a comment." });
    }

    const { title, postId } = req.body.data;
    console.log(title, postId);
    //Get User
    const prismaUser = await prisma.user.findUnique({
      where: { email: session?.user?.email ?? "" },
    });
    console.log(prismaUser);
    //Check title
    if (title.length > 300) {
      return res.status(403).json({ err: "Please write a shorter comment" });
    }

    if (!title.length) {
      return res
        .status(403)
        .json({ err: "Please write something before we can comment it." });
    }

    //Create Comment
    if (prismaUser) {
      try {
        const result = await prisma.comment.create({
          data: {
            title,
            userId: prismaUser.id,
            postId,
          },
        });
        res.status(200).json(result);
      } catch (err) {
        res.status(403).json({ err: "Error has occurred while adding a comment" });
      }
    } else {
      res.status(403).json({ err: "User not found" });
    }
  }
}
