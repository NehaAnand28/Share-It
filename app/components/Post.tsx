"use client";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaHeart } from "react-icons/fa";
import { useState } from "react";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

type PostData = {
  id: string;
  avatar: string;
  name: string;
  postTitle: string;
  comments?: {
    id: string;
    postId: string;
    userId: string;
  }[];
  hearts?: {
    id: string;
    postId: string;
    userId: string;
  }[];
};

type Heart = {
  postId?: string;
};

const Post: React.FC<PostData> = ({
  id,
  name,
  avatar,
  postTitle,
  comments,
  hearts,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(hearts?.length ?? 0);
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: Heart) => {
      return axios.post("/api/posts/addLike", { data });
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries(["posts","auth-posts"] as InvalidateQueryFilters);
      
    },
    onError: (error) => {
      console.log(error);
      if (error instanceof AxiosError) {
        toast.error(error?.response?.data.err);
      }
    },
  });

  const handleLikeToggle = () => {
    setIsLiked(!isLiked);
    // Update like count
    setLikeCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
    mutation.mutate({ postId: id });
    // Toggle like state
  };
  return (
    <motion.div
      animate={{ opacity: 1, scale: 1 }}
      initial={{ opacity: 0, scale: 0.8 }}
      transition={{ ease: "easeOut" }}
      className="bg-white my-8 p-8 rounded-lg "
    >
      <div className="flex items-center gap-2">
        <Image
          className="rounded-full"
          width={32}
          height={32}
          src={avatar}
          alt="avatar"
        />
        <h3 className="font-bold text-gray-700 ">{name}</h3>
      </div>
      <div className="my-8 ">
        <p className="text-black text-lg break-all">{postTitle}</p>
      </div>
      <div className="flex gap-6 cursor-pointer items-center">
        <Link
          href={{
            pathname: `/post/${id}`,
          }}
        >
          <p className=" text-sm font-bold text-gray-700">
            {comments?.length} Comments
          </p>
        </Link>
        <div className="flex gap-2 items-center">
          <button onClick={handleLikeToggle}>
            {isLiked || (likeCount > 0) ? (
              <FaHeart className=" text-lg text-red-600" />
            ) : (
              <FaHeart className="text-gray-500" />
            )}
          </button>
          <p className="text-sm font-bold text-gray-700">{likeCount} Likes</p>
        </div>
      </div>
    </motion.div>
  );
};
export default Post;
