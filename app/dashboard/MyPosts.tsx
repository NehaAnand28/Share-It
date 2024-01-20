"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { AuthPosts } from "../types/AuthPosts";
import EditPost from "./EditPost";
const fetchAuthPosts = async () => {
  const response = await axios.get("/api/posts/authPosts");
  return response.data;
};

export default function MyPosts(): JSX.Element {
   const { data, error, isPending } = useQuery<AuthPosts>({
     queryFn: fetchAuthPosts,
     queryKey: ["auth-posts"],
   });
  if (isPending) return <h1>Posts are loading...</h1>;
  return (
    <div>
      {data?.posts?.map((post) => (
        <EditPost
          id={post.id}
          key={post.id}
          avatar={data.image}
          name={data.name}
          title={post.title}
          comments={post.comments}
          hearts={post.hearts}
        />
      ))}
    </div>
  );
}
