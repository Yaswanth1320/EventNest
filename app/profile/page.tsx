"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { Trash2, Mail, Pencil, CalendarIcon } from "lucide-react";
import {
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import PostItem from "@/components/PostItem";
import { PostTypes } from "@/app/page";
import { db } from "@/config/firebase";
import { toast } from "sonner";

// shadcn/ui components
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const ProfilePage = () => {
  const { data: session } = useSession();
  const [posts, setPosts] = useState<PostTypes[]>([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPost, setCurrentPost] = useState<PostTypes | null>(null);

  // Fetch user's posts
  useEffect(() => {
    const fetchUserPosts = async () => {
      if (!session?.user?.email) return;
      setLoading(true);
      const q = query(
        collection(db, "posts"),
        where("user.email", "==", session.user.email)
      );
      const querySnapshot = await getDocs(q);
      const userPosts: PostTypes[] = querySnapshot.docs.map((docSnap) => {
        const data = docSnap.data() as Omit<PostTypes, "id">;
        return { id: docSnap.id, ...data };
      });
      setPosts(userPosts);
      setLoading(false);
    };
    fetchUserPosts();
  }, [session?.user?.email]);

  // Delete post
  const handleDelete = async (postId: string) => {
    try {
      const q = query(collection(db, "posts"), where("id", "==", postId));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await deleteDoc(docRef);
        setPosts((prev) => prev.filter((p) => p.id !== postId));
        toast.success("Post deleted successfully!");
      }
    } catch (err) {
      toast.error("Error deleting post.");
      console.error("Error deleting post:", err);
    }
  };

  // Edit post
  const handleEdit = (post: PostTypes) => {
    setCurrentPost(post);
    setIsModalOpen(true);
  };

  // Update post
  const handleUpdate = async () => {
    if (!currentPost) return;

    try {
      const q = query(
        collection(db, "posts"),
        where("id", "==", currentPost.id)
      );
      const querySnapshot = await getDocs(q);
      if (!querySnapshot.empty) {
        const docRef = querySnapshot.docs[0].ref;
        await updateDoc(docRef, { ...currentPost });
        setPosts((prev) =>
          prev.map((p) => (p.id === currentPost.id ? currentPost : p))
        );
        setIsModalOpen(false);
        toast.success("Successfully updated the post!");
      }
    } catch (err) {
      toast.error("Error updating post.");
      console.log(err);
    }
  };

  if (!session) {
    return (
      <div className="p-6 glass rounded-2xl shadow-lg text-center mt-20">
        <h2 className="text-xl font-bold text-black dark:text-white">
          Please log in to view your profile
        </h2>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8 mt-22">
      {/* Profile Card */}
      <div className="glass p-6 rounded-2xl shadow-lg flex items-center gap-6">
        <Image
          src={session.user?.image || "/default-avatar.png"}
          alt={session.user?.name || "User"}
          width={80}
          height={80}
          className="rounded-full border border-gray-300 dark:border-gray-700"
        />
        <div>
          <h1 className="text-2xl font-bold text-black dark:text-white">
            {session.user?.name}
          </h1>
          <p className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <Mail className="w-4 h-4 text-purple-500" />
            {session.user?.email}
          </p>
        </div>
      </div>

      {/* User Posts */}
      <div>
        <h2 className="text-xl font-bold mb-4 text-black dark:text-white">
          My Posts
        </h2>

        {loading ? (
          <p className="text-gray-600 dark:text-gray-400">Loading posts...</p>
        ) : posts.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400">
            You haven’t posted anything yet.
          </p>
        ) : (
          <div className="grid gap-6">
            {posts.map((post) => (
              <div
                key={post.id}
                className="relative group hover:bg-gray-50 dark:hover:bg-gray-800 p-4 rounded-xl transition"
              >
                <PostItem post={post} />

                {/* Edit/Delete on hover */}
                <div className="absolute top-2 right-2 flex flex-col gap-2 opacity-0 translate-x-6 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                  <button
                    onClick={() => handleEdit(post)}
                    className="p-2 rounded-full bg-gray-500 text-white hover:bg-gray-600 transition shadow-lg"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <button className="p-2 rounded-full bg-red-500 text-white hover:bg-red-600 transition shadow-lg">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action will permanently delete this post.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(post.id!)}
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {isModalOpen && currentPost && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-neutral-900 w-full max-w-3xl p-8 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700">
            <h2 className="text-2xl font-bold mb-6 text-black dark:text-white text-center">
              ✏️ Edit Post
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  value={currentPost.title || ""}
                  onChange={(e) =>
                    setCurrentPost((prev) =>
                      prev ? { ...prev, title: e.target.value } : prev
                    )
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white"
                />
              </div>

              {/* Description */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={currentPost.desc || ""}
                  onChange={(e) =>
                    setCurrentPost((prev) =>
                      prev ? { ...prev, desc: e.target.value } : prev
                    )
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white"
                />
              </div>

              {/* Location Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={currentPost.location || ""}
                  onChange={(e) =>
                    setCurrentPost((prev) =>
                      prev ? { ...prev, location: e.target.value } : prev
                    )
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white"
                />
              </div>

              {/* Pin Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Pin Code
                </label>
                <input
                  type="text"
                  value={currentPost.pinCode || ""}
                  onChange={(e) =>
                    setCurrentPost((prev) =>
                      prev ? { ...prev, pinCode: e.target.value } : prev
                    )
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white"
                />
              </div>

              {/* Category Select */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Category
                </label>
                <Select
                  value={currentPost.category || ""}
                  onValueChange={(val) =>
                    setCurrentPost((prev) =>
                      prev ? { ...prev, category: val } : prev
                    )
                  }
                >
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fitness">🏋️ Fitness</SelectItem>
                    <SelectItem value="yoga">🧘 Yoga</SelectItem>
                    <SelectItem value="trekking">⛰️ Trekking</SelectItem>
                    <SelectItem value="sports">⚽ Sports</SelectItem>
                    <SelectItem value="dance">💃 Dance</SelectItem>
                    <SelectItem value="music">🎵 Music</SelectItem>
                    <SelectItem value="gaming">🎮 Gaming</SelectItem>
                    <SelectItem value="comedy">😂 Comedy</SelectItem>
                    <SelectItem value="tech">🖥️ Tech</SelectItem>
                    <SelectItem value="others">✨ Others</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Date Picker */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal rounded-xl"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {currentPost.date
                        ? format(new Date(currentPost.date), "PPP")
                        : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={
                        currentPost.date
                          ? new Date(currentPost.date)
                          : undefined
                      }
                      onSelect={(date) =>
                        setCurrentPost((prev) =>
                          prev
                            ? { ...prev, date: date?.toISOString() || "" }
                            : prev
                        )
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Time
                </label>
                <input
                  type="time"
                  value={currentPost.time || ""}
                  onChange={(e) =>
                    setCurrentPost((prev) =>
                      prev ? { ...prev, time: e.target.value } : prev
                    )
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white"
                />
              </div>

              {/* Social Link */}
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Social Link
                </label>
                <input
                  type="text"
                  value={currentPost.socialLink || ""}
                  onChange={(e) =>
                    setCurrentPost((prev) =>
                      prev ? { ...prev, socialLink: e.target.value } : prev
                    )
                  }
                  className="w-full px-4 py-2 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-black text-black dark:text-white"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex justify-end gap-4 mt-8">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 rounded-xl bg-gray-300 dark:bg-gray-700 text-black dark:text-white hover:bg-gray-400 dark:hover:bg-gray-600 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-5 py-2.5 rounded-xl bg-black dark:bg-white text-white dark:text-black hover:opacity-80 transition"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfilePage;
