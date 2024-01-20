"use client";

import { useState } from "react";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { PostsType } from "../types/PostsType";

type Comment = {
  postId?: string;
  title: string;
};
type PostProps = {
  id?: string;
};
export default function AddComment({ id }: PostProps) {
  let commentToastId: string;
  console.log(id);
  const [title, setTitle] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);

  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: Comment) => {
      return axios.post("/api/posts/addComment", { data });
    },

    onSuccess: async(data) => {
      setTitle("");
      await queryClient.invalidateQueries(["detail-post"] as InvalidateQueryFilters);
      setIsDisabled(false);
      toast.dismiss(commentToastId)
      toast.success("Added your comment", { id: commentToastId });
    },
    onError: (error) => {
      console.log(error);
      setIsDisabled(false);
      if (error instanceof AxiosError) {
        toast.dismiss(commentToastId)
        toast.error(error?.response?.data.err, { id: commentToastId });
      }
    },
  });

  const submitPost = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDisabled(true);
    commentToastId = toast.loading("Adding your comment", {
      id: commentToastId,
    });
    mutation.mutate({ title, postId: id });
  };
  return (
    <form onSubmit={submitPost} className="my-8">
      <h3 className="text-xl">Add a comment</h3>

      <div className="flex flex-col my-2 text-black">
        <input
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          type="text"
          name="title"
          className=" outline-none p-4 text-lg rounded-md my-2"
        />
      </div>
      <div className="flex items-center gap-2">
        <button
          disabled={isDisabled}
          className=" text-sm bg-teal-600 text-white py-2 px-6 rounded-xl disabled:opacity-25"
          type="submit"
        >
          Add Comment 🚀
        </button>
        <p
          className={`font-bold  ${
            title.length > 300 ? "text-red-700" : "text-gray-700"
          } `}
        >{`${title.length}/300`}</p>
      </div>
    </form>
  );
}
