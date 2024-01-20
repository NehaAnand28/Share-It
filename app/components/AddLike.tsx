"use client";

import { useState } from "react";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { FaHeart } from "react-icons/fa";


type Heart = {
  id: string;
  postId: string;
  userId: string;
};

type PostProps = {
  id?: string;
  hearts?: {
    id: string;
    postId: string;
    userId: string;
  }[];
};
export default function AddLike({ id ,hearts}: PostProps) {
    const [likeCount, setLikeCount] = useState(hearts?.length ?? 0);
    const [isLiked, setIsLiked] = useState(
     ( likeCount > 0) ? true : false
    );
   const queryClient = useQueryClient();
   const mutation = useMutation({
     mutationFn: (data: PostProps) => {
       return axios.post("/api/posts/addLike", { data });
     },

     onSuccess: (data) => {
       queryClient.invalidateQueries([
         "posts","detail-posts","auth-posts"
       ] as InvalidateQueryFilters);
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
     mutation.mutate({ id: id });
     // Toggle like state
   };
  return (
    <div className="flex gap-2 items-center">
      <button onClick={handleLikeToggle}>
        { likeCount > 0 || isLiked ? (
          <FaHeart className=" text-lg text-red-600" />
        ) : (
          <FaHeart className="text-gray-500" />
        )}
      </button>
      <p className="text-sm font-bold text-gray-700">{likeCount} Likes</p>
    </div>
  );
}
