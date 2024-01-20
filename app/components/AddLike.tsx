"use client";

import { useState,useEffect } from "react";
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(
    hearts?.some((heart) => heart.userId === currentUserId) ?? false
  );
  const [likeCount, setLikeCount] = useState(0);
  // const [noOfHearts , setNoOfHearts] =useState(hearts?.length ?? 0)
  const queryClient = useQueryClient();
   const mutation = useMutation({
     mutationFn: async (data: PostProps) => {
       return await axios.post("/api/posts/addLike", { data });
     },

     onSuccess: async (data) => {
       await queryClient.invalidateQueries([
         "posts","auth-posts","detail-post"
       ] as InvalidateQueryFilters);
     },
     onError: (error) => {
       if (error instanceof AxiosError) {
         toast.error(error?.response?.data.err);
       }
     },
   });

    useEffect(() => {
      const getCurrentUser = async () => {
        try {
          const response = await axios.get<string>("/api/user/getCurrentUser");
          setCurrentUserId(response.data);
        } catch (error: any) {
          console.error("Error fetching current user ID", error);
        }
      };

      getCurrentUser();
    }, []);

    const noOfHearts = hearts?.length ?? 0

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
        { noOfHearts > 0 || isLiked ? (
          <FaHeart className=" text-lg text-red-600" />
        ) : (
          <FaHeart className="text-gray-500" />
        )}
      </button>
      <p className="text-sm font-bold text-gray-700">{noOfHearts} Likes</p>
    </div>
  );
}
