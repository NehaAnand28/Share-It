import prisma from "../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    //Create Post

    try {
      const data = await prisma.post.findMany({
        include: {
          user: true,
          comments: true,
          hearts: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      });
      console.log(data);
      return res.status(200).json(data);
    } catch (err) {
      res.status(403).json({ err: "Error has occured while making a post" });
    }
  }
}
