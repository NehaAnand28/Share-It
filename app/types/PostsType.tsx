export type PostsType = {
  title: string;
  id: string;
  createdAt?: string;
  comments?: {
    title: string;
    user: any;
    createdAt: string;
    id: string;
    postId: string;
    userId: string;
  }[];
  user: {
    name: string;
    image: string;
  };
};
