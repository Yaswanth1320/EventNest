"use client";

import React, { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { AlertTriangle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { format, formatDistanceToNow } from "date-fns";
import Image from "next/image";
import { Loader2, Users, Calendar, Star } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { PostTypes } from "../page";
import { db } from "@/config/firebase";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const { data: session, status } = useSession();
  const [posts, setPosts] = useState<PostTypes[]>([]);
  const [loading, setLoading] = useState(true);

  // Always call hooks first, no early returns
  useEffect(() => {
    const fetchPosts = async () => {
      if (!session?.user?.email) return;

      try {
        const q = query(
          collection(db, "posts"),
          where("user.email", "==", session.user.email)
        );
        const querySnapshot = await getDocs(q);

        const data: PostTypes[] = querySnapshot.docs.map((doc) => {
          const postData = doc.data() as PostTypes;
          return {
            ...postData,
            id: doc.id,
            interested:
              postData.interested?.map((u) => ({
                ...u,
                joinedAt: u.joinedAt || new Date().toISOString(),
              })) || [],
          };
        });

        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [session?.user?.email]);

  if (status === "loading" || loading) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500 font-mono">
        <Loader2 className="w-6 h-6 animate-spin mr-2" />
        Loading dashboard...
      </div>
    );
  }

  if (!session?.user?.email) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center px-6">
        <AlertTriangle className="w-10 h-10 text-yellow-500 mb-4 animate-pulse" />
        <h1 className="text-2xl font-bold mb-2">You are not logged in</h1>
        <p className="text-gray-600 mb-6">
          Please log in to access your dashboard and view your events.
        </p>
        <Button
          onClick={() => signIn()}
          className="px-6 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg transition"
        >
          Log In
        </Button>
      </div>
    );
  }

  const totalEvents = posts.length;
  const totalParticipants = posts.reduce(
    (acc, p) => acc + (p.interested?.length || 0),
    0
  );
  const mostPopularEvent =
    posts.length > 0
      ? posts.reduce(
          (prev, curr) =>
            (curr.interested?.length || 0) > (prev.interested?.length || 0)
              ? curr
              : prev,
          posts[0]
        )
      : ({
          id: "0",
          title: "N/A",
          desc: "",
          location: "",
          category: "",
          createdAt: { seconds: Date.now() / 1000 } as any,
          interested: [],
          user: { name: "", email: "", image: "" },
        } as PostTypes);

  return (
    <div className="max-w-6xl mx-auto py-25 px-6 font-mono">
      <h1 className="text-3xl font-bold mb-10 text-gray-800 dark:text-gray-100 text-center">
        My Events Dashboard
      </h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="p-6 rounded-2xl bg-blue-50 dark:bg-blue-900/30 shadow-md flex flex-col items-start">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            <h2 className="text-lg font-semibold">Events Created</h2>
          </div>
          <p className="text-3xl font-mono">{totalEvents}</p>
        </div>

        <div className="p-6 rounded-2xl bg-green-50 dark:bg-green-900/30 shadow-md flex flex-col items-start">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
            <h2 className="text-lg font-semibold">Total Participants</h2>
          </div>
          <p className="text-3xl font-mono">{totalParticipants}</p>
        </div>

        <div className="p-6 rounded-2xl bg-yellow-50 dark:bg-yellow-900/30 shadow-md flex flex-col items-start">
          <div className="flex items-center gap-3 mb-2">
            <Star className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            <h2 className="text-lg font-semibold">Most Popular Event</h2>
          </div>
          <p className="text-xl font-medium truncate">
            {mostPopularEvent.title}
          </p>
          <p className="text-sm text-gray-500">
            {mostPopularEvent.interested?.length || 0} participants
          </p>
        </div>
      </div>

      {/* Events List */}
      {posts.length === 0 ? (
        <p className="text-center text-gray-500 font-mono">
          You haven’t created any events yet.
        </p>
      ) : (
        <Accordion type="single" collapsible className="space-y-5 mb-8">
          {posts.map((post) => (
            <AccordionItem
              key={post.id}
              value={post.id}
              className="border rounded-xl shadow-md px-5 py-3"
            >
              <AccordionTrigger className="text-lg font-semibold no-underline hover:no-underline flex justify-between items-center">
                <span>{post.title}</span>
                <Badge
                  variant="secondary"
                  className="ml-3 bg-gray-200 dark:bg-gray-700"
                >
                  {post.interested?.length || 0} participants
                </Badge>
              </AccordionTrigger>

              <AccordionContent className="mt-3">
                {post.interested && post.interested.length > 0 ? (
                  <ul className="space-y-4">
                    {post.interested.map((user, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-4 border-b pb-3 last:border-b-0"
                      >
                        {user.image && (
                          <Image
                            src={user.image}
                            alt={user.name}
                            width={36}
                            height={36}
                            className="rounded-full border"
                          />
                        )}
                        <div className="flex flex-col">
                          <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">{user.email}</p>
                          <p className="text-xs text-gray-400">
                            Applied{" "}
                            {formatDistanceToNow(new Date(user.joinedAt))} ago •{" "}
                            {format(new Date(user.joinedAt), "PPPp")}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-sm">No participants yet.</p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      )}

      {/* Beta Mode Indicator */}
      <h2 className="flex items-center justify-center gap-3 my-10 text-yellow-500 font-semibold text-lg">
        <AlertTriangle className="w-5 h-5 animate-pulse" />
        Beta Development Mode
      </h2>
    </div>
  );
};

export default Dashboard;
