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
    console.log("in add like session", session);
    if (!session) {
      console.log("error in getting session");
      return res
        .status(401)
        .json({ err: "Please signin to add a comment." });
    }

    //Get User
    const prismaUser = await prisma.user.findUnique({
      where: { email: session?.user?.email ?? "" },
    });
    //check to see if post was liked by user
    if (prismaUser) {
      const heart = await prisma.heart.findFirst({
        where: {
          postId: req.body.data.id,
          userId: prismaUser.id,
        },
      });
      console.log("hearts",heart)
      try {
        if (!heart) {
          const result = await prisma.heart.create({
            data: {
              postId: req.body.data.id,
              userId: prismaUser.id,
            },
          });
          console.log(result);
          res.status(201).json(result);
        } else {
          const result = await prisma.heart.delete({
            where: {
              id: heart.id,
            },
          });
          res.status(200).json(result);
        }
      } catch (err) {
        res.status(403).json({ err: "Error has occured while adding a like" });
      }
    }
  }
}
