import prisma from "../../../prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {

  if (req.method === "GET") {
    try {
      const postId = req.query.details;
      if(typeof postId === "string"){
        const data = await prisma.post.findUnique({
          where: {
            id: postId,
          },
          include: {
            user: true,
            hearts: true,
            comments: {
              orderBy: {
                createdAt: "desc",
              },
              include: {
                user: true,
              },
            },
          },
        });
        return res.status(200).json(data);
      }else{
        res.status(403).json({ err: "Invalid details parameter" });
      }
    } catch (err) {
      res.status(403).json({ err: "Error has occured while making a post" });
    }
  }
}
