'use client'
import { useQuery } from "@tanstack/react-query"
import CreatePost from "./components/CreatePost"
import Post from "./components/Post"
import axios from "axios"
import { PostsType } from "./types/PostsType"

//Fetch All posts
const allPosts = async () => {
  const response = await axios.get("/api/posts/getPosts")
  return response.data
}

export default function Home() {
    const { data, error, isPending} = useQuery<PostsType[]>({
      queryFn: allPosts,
      queryKey: ["posts"],
    });
    if (error) return error;
    if (isPending) return "Loading.....";
  return (
    <main>
      <h1>Share your thoughts with the world!</h1>
      <CreatePost />
      {data?.map((post : any) => (
        <Post
          key={post.id}
          id={post.id}
          name={post.user?.name}
          avatar={post.user?.image}
          postTitle={post.title}
          comments={post.comments}
          hearts={post.hearts}
        />
      ))}
    </main>
  );
}
