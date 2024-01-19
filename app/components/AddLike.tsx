"use client";

import { useState } from "react";
import {
  InvalidateQueryFilters,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";


type Comment = {
  postId?: string;
  title: string;
};
type PostProps = {
  id?: string;
};
export default function AddLike({ id }: PostProps) {
 
  return (
   <div></div>
  );
}
