"use client";
import Hero from "@/components/Hero";
import SearchBar from "@/components/Search";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useEffect, useState } from "react";
import Posts from "@/components/Posts";
import CategoryList from "@/components/GameList";

export type PostTypes = {
  id: string;
  title: string;
  desc: string;
  location: string;
  date?: string;
  time?: string;
  timestamp?: string;
  socialLink?: string;
  category?: string;
  pinCode?: string;
  createdAt?: { seconds: number; nanoseconds: number };
  user?: { name: string; email: string; image: string };
  interested: {
    name: string;
    email: string;
    image: string;
    joinedAt: string;
  }[];
};

export default function Home() {
  const [posts, setPosts] = useState<PostTypes[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");

  // Fetch posts from Firestore
  const getPostData = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const fetchedPosts: PostTypes[] = querySnapshot.docs.map((doc) => {
        return doc.data() as PostTypes;
      });
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getPostData();
  }, []);

  // Filter posts based on search text AND category
  const filteredPosts = posts.filter((post) => {
    const text = searchText.toLowerCase();
    const locationMatch = post.location?.toLowerCase().includes(text);
    const pinMatch = post.pinCode?.toLowerCase().includes(text);
    const categoryMatch = selectedCategory
      ? post.category?.toLowerCase() === selectedCategory.toLowerCase()
      : true;

    return (locationMatch || pinMatch) && categoryMatch;
  });

  return (
    <main className="font-mono flex flex-col items-center justify-start pt-32 px-4 space-y-10 mb-10">
      {/* Hero Section */}
      <div className="glass p-6 w-full max-w-3xl text-center rounded-2xl">
        <Hero />
      </div>

      {/* Search Section */}
      <div className="w-full max-w-2xl">
        <SearchBar searchText={searchText} setSearchText={setSearchText} />
      </div>

      {/* Game List Section */}
      <div className="glass p-6 w-full max-w-5xl rounded-2xl">
        <CategoryList
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
        />
        <Posts posts={filteredPosts} loading={loading} />
      </div>
    </main>
  );
}
