"use client";

import { InvalidateQueryFilters, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import toast from "react-hot-toast";
import axios, { AxiosError,AxiosResponse } from "axios";

export default function CreatePost() {
  const [title, setTitle] = useState("");
  const [isDisabled, setIsDisabled] = useState(false);
  const queryClient = useQueryClient();
  let toastPostID: string = "";

  //Create a post
  const mutation = useMutation({
    mutationFn: () => {
      return axios.post("/api/posts/addPost", {title : title});
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        toast.dismiss(toastPostID);
        toast.error(error?.response?.data?.err, { id: toastPostID });
      }
      setIsDisabled(false);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["posts"] as InvalidateQueryFilters);
      toast.dismiss(toastPostID)
      toast.success("Post has been made 🔥", { id: toastPostID });
      setTitle("");
      setIsDisabled(false);
    },
  });
 

 const submitPost = async (e: React.FormEvent) => {
   e.preventDefault();
   setIsDisabled(true);
   toastPostID = toast.loading("Creating your post", { id: toastPostID });
  mutation.mutate();
 };

  return (
    <form onSubmit={submitPost} className="bg-white my-8 p-8 rounded-md ">
      <div className="flex flex-col my-4">
        <textarea
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          name="title"
          placeholder="What's on your mind?"
          className="p-4 text-lg text-black rounded-md my-2  bg-gray-200"
        />
      </div>
      <div className=" flex items-center justify-between gap-2">
        <p
          className={`font-bold text-sm ${
            title.length > 300 ? "text-red-700" : "text-gray-700"
          } `}
        >{`${title.length}/300`}</p>
        <button
          disabled={isDisabled}
          className="text-sm bg-teal-600 text-white py-2 px-6 rounded-xl disabled:opacity-25"
          type="submit"
        >
          Create post
        </button>
      </div>
    </form>
  );
}
