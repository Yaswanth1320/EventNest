"use client";

import { PostTypes } from "@/app/page";
import React, { useState, useEffect } from "react";
import { Calendar, MapPin, Mail, Users } from "lucide-react";
import { FaWhatsapp, FaTelegramPlane, FaGlobe } from "react-icons/fa";
import Image from "next/image";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  collection,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "@/config/firebase";
import { format } from "date-fns";

// Map categories → text color
const categoryColors: Record<string, string> = {
  fitness: "text-green-600",
  yoga: "text-purple-600",
  trekking: "text-amber-600",
  sports: "text-blue-600",
  dance: "text-pink-600",
  music: "text-red-600",
  gaming: "text-yellow-600",
  comedy: "text-orange-600",
  art: "text-indigo-600",
  food: "text-rose-600",
  tech: "text-cyan-600",
};

// Utility to detect social platform from URL
const getSocialIcon = (url: string) => {
  if (!url) return null;

  if (url.includes("whatsapp")) {
    return {
      icon: <FaWhatsapp className="text-green-500 w-4 h-4" />,
      label: "WhatsApp",
    };
  }
  if (
    url.includes("t.me") ||
    url.includes("telegram") ||
    url.includes("telega")
  ) {
    return {
      icon: <FaTelegramPlane className="text-blue-500 w-4 h-4" />,
      label: "Telegram",
    };
  }
  return {
    icon: <FaGlobe className="text-gray-500 w-4 h-4" />,
    label: "Website",
  };
};

type PostItemProps = {
  post: PostTypes;
};

const PostItem = ({ post }: PostItemProps) => {
  const { data: session } = useSession();
  const [participants, setParticipants] = useState(post.interested || []);
  const [isApplied, setIsApplied] = useState(false);

  // ✅ Check if user already applied
  useEffect(() => {
    if (session?.user?.email) {
      const alreadyApplied = participants.some(
        (u: any) => u.email === session.user?.email
      );
      setIsApplied(alreadyApplied);
    }
  }, [participants, session?.user?.email]);

  // Format timestamp
  const formattedDate = post.date
    ? format(new Date(post.date), "PPP p") // "Aug 28, 2025 6:30 PM"
    : "No date";

  const social = post.socialLink ? getSocialIcon(post.socialLink) : null;

  const categoryColor =
    (post.category && categoryColors[post.category.toLowerCase()]) ||
    "text-black dark:text-white";

  const isMyPost = post.user?.email === session?.user?.email;

  // ✅ Interested button handler (fixed with query)
  const handleInterested = async () => {
    if (!session?.user?.email) return;

    try {
      const q = query(collection(db, "posts"), where("id", "==", post.id));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.error("Post not found");
        return;
      }

      const docRef = querySnapshot.docs[0].ref;
      const postData = querySnapshot.docs[0].data();
      const interested = postData.interested || [];

      const alreadyInterested = interested.some(
        (u: any) => u.email === session.user?.email
      );

      if (alreadyInterested) {
        setIsApplied(true);
        toast.error("Already Applied", {
          description: "You have already marked yourself as interested.",
        });
        return;
      }

      const newUser = {
        name: session.user?.name || "Anonymous",
        email: session.user?.email,
        image: session.user?.image || "",
        joinedAt: new Date().toISOString(),
      };

      const updatedInterested = [...interested, newUser];

      await updateDoc(docRef, { interested: updatedInterested });

      setIsApplied(true);
      setParticipants(updatedInterested);

      toast.success("Application Successful 🎉", {
        description: "You have been added to the participant list.",
      });
    } catch (error) {
      console.error("Error updating interested:", error);
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
    }
  };

  return (
    <div className="p-5 rounded-2xl glass font-mono shadow-md hover:shadow-lg transition transform hover:-translate-y-1 hover:dark:border-white hover:border-black flex flex-col justify-between">
      {/* Title + Participants */}
      <div className="flex items-center justify-between mb-3">
        <h2 className={`font-bold text-lg transition-colors ${categoryColor}`}>
          {post.title}
        </h2>

        <div className="flex items-center gap-1 text-xs text-gray-600 dark:text-gray-300">
          <Users className="w-4 h-4 text-purple-700" />
          {participants.length}
        </div>
      </div>

      {/* Date + Location */}
      <div className="space-y-2 mb-3 text-sm">
        <div className="flex items-center text-gray-700 dark:text-gray-300">
          <Calendar className="w-4 h-4 mr-2 text-blue-500" />
          {formattedDate}
        </div>
        <div className="flex items-center text-black dark:text-white">
          <MapPin className="w-4 h-4 mr-2 text-red-500" />
          {post.location}
        </div>
      </div>

      {/* Description */}
      <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
        {post.desc}
      </p>

      {/* User who posted */}
      {post.user && (
        <div className="flex items-center gap-1 mb-4">
          <span className="text-[10px] text-gray-500 dark:text-gray-400">
            Posted by:
          </span>
          <Image
            src={post.user.image}
            alt={post.user.name}
            width={15}
            height={15}
            className="rounded-full border border-gray-300 dark:border-gray-700"
          />
          <span className="text-[10px] text-gray-800 dark:text-gray-200 font-medium">
            {post.user.email === session?.user?.email ? "You" : post.user.name}
          </span>
        </div>
      )}

      {/* Footer with Read More + Interested */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-gray-200 dark:border-gray-700">
        {/* Read More Modal */}
        <Dialog>
          <DialogTrigger asChild>
            <button className="relative text-sm font-semibold transition duration-300 group">
              Read More
              <span className="absolute left-0 bottom-0 h-[2px] w-0 bg-current transition-all duration-300 group-hover:w-full"></span>
            </button>
          </DialogTrigger>

          <DialogContent className="max-w-lg glass rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800">
            <DialogHeader>
              <DialogTitle
                className={`text-2xl font-bold transition-colors ${categoryColor}`}
              >
                {post.title}
              </DialogTitle>
              <DialogDescription className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="w-4 h-4 text-blue-500" />
                {formattedDate} •
                <MapPin className="w-4 h-4 text-red-500 ml-1" />
                {post.location}
              </DialogDescription>
            </DialogHeader>

            {/* Full description */}
            <p className="text-base text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
              {post.desc}
            </p>

            {/* Social Link */}
            {post.socialLink && post.socialLink !== "Not provided" ? (
              <a
                href={post.socialLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-base font-medium text-blue-600 dark:text-blue-400 mb-2 hover:underline"
              >
                <span className="p-2 rounded-full bg-gray-100 dark:bg-gray-800 shadow-sm">
                  {social?.icon}
                </span>
                {social?.label === "Website" ? "Social Link" : social?.label}
              </a>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400 italic">
                No link available
              </p>
            )}

            {/* User info with Avatar Stack */}
            {post.user && (
              <div className="flex items-center justify-between border-t pt-4">
                <div className="flex items-center gap-3">
                  <Image
                    src={post.user.image}
                    alt={post.user.name}
                    width={28}
                    height={28}
                    className="rounded-full border border-gray-300 dark:border-gray-700 shadow-sm"
                  />
                  <div>
                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {post.user.email === session?.user?.email
                        ? "You"
                        : post.user.name}
                    </p>
                    {post.user.email &&
                      post.user.email !== session?.user?.email && (
                        <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <Mail className="w-3 h-3 text-purple-500" />
                          <span>{post.user.email}</span>
                        </div>
                      )}
                  </div>
                </div>

                {/* Avatar stack for participants */}
                {participants.length > 0 && (
                  <div className="flex -space-x-2">
                    {participants.map((p, idx) => (
                      <Image
                        key={idx}
                        src={p.image || "/default-avatar.png"}
                        alt={p.name}
                        width={24}
                        height={24}
                        className="rounded-full border border-white dark:border-gray-800"
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Interested Button */}
        {!isMyPost && (
          <button
            onClick={handleInterested}
            disabled={isApplied}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition ${
              isApplied
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-black text-white hover:bg-gray-800 dark:bg-white dark:text-black dark:hover:bg-gray-200"
            }`}
          >
            {isApplied ? "Applied" : "Interested"}
          </button>
        )}
      </div>
    </div>
  );
};

export default PostItem;
