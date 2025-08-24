"use client";

import { PostTypes } from "@/app/page";
import React from "react";
import PostItem from "./PostItem";
import { useSession, signIn } from "next-auth/react";
import { Button } from "./ui/button";

type PostsProps = {
  posts: PostTypes[];
  loading: boolean;
};

const Posts = ({ posts, loading }: PostsProps) => {
  const { data: session, status } = useSession();
  console.log(posts)

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center justify-center h-20 space-y-1">
        <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
        <span className="font-mono text-xs text-black tracking-widest dark:text-white animate-pulse">
          Checking session...
        </span>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-40 glass rounded-2xl p-6">
        <p className="font-mono text-lg text-gray-600">🔒 Login required</p>
        <p className="font-mono text-sm text-gray-400 mb-2">
          Log in to see events near you
        </p>
        <Button
          onClick={() => signIn()}
          className="px-4 py-2 text-sm font-mono rounded-lg transition-colors 
             bg-black text-white hover:bg-gray-8800
             dark:bg-white dark:text-black dark:hover:bg-gray-200"
        >
          Log in
        </Button>
      </div>
    );
  }

  // if logged in and still loading posts
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-20 space-y-1">
        <div className="w-4 h-4 border-2 border-gray-400 border-t-black rounded-full animate-spin"></div>
        <span className="font-mono text-xs text-black tracking-widest dark:text-white animate-pulse">
          Loading posts...
        </span>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center h-40 glass rounded-2xl p-6">
        <p className="font-mono text-lg text-gray-600">📭 No posts yet</p>
        <p className="font-mono text-sm text-gray-400">
          Be the first to add one!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {posts.map((post, idx) => (
        <PostItem key={idx} post={post} />
      ))}
    </div>
  );
};

export default Posts;
