"use client";

import Post from "@/app/components/Post";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { PostsType } from "@/app/types/PostsType";
import { motion } from "framer-motion";
import AddComment from "@/app/components/AddComment";

type URL = {
  params: {
    slug: string;
  };
  searchParams: string;
};
//Fetch All posts
const fetchDetails = async (slug: string) => {
  const response = await axios.get(`/api/posts/${slug}`);
  return response.data;
};

export default function PostDetail(url: URL) {
  const { data, isPending } = useQuery<PostsType>({
    queryKey: ["detail-post"],
    queryFn: () => fetchDetails(url.params.slug),
  });
  if (isPending) return "Loading";
  console.log(data);
  return (
    <div>
      {data && (
        <Post
          id={data?.id}
          name={data?.user?.name}
          avatar={data?.user?.image}
          postTitle={data?.title}
          comments={data?.comments}
          hearts={data?.hearts}
        />
      )}
      <AddComment id={data?.id} />
      {data?.comments?.map((comment) => (
        <motion.div
          animate={{ opacity: 1, scale: 1 }}
          initial={{ opacity: 0, scale: 0.8 }}
          transition={{ ease: "easeOut" }}
          className="my-6 bg-white p-8 rounded-md"
          key={comment.id}
        >
          <div className="flex items-center gap-2">
            <Image
              width={24}
              height={24}
              src={comment?.user?.image}
              alt="avatar"
            />
            <h3 className="font-bold text-gray-700 ">{comment?.user?.name}</h3>
            <h2 className="text-sm text-gray-400">{comment.createdAt}</h2>
          </div>
          <div className="py-4 text-black text-lg">{comment.title}</div>
        </motion.div>
      ))}
    </div>
  );
}   
