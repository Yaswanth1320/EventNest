"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import {
  CalendarIcon,
  Loader2,
  MapPin,
  Type,
  Clock,
  FileText,
  Link as LinkIcon,
  Tags,
} from "lucide-react";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { enUS } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/config/firebase";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

export default function Create() {
  const { data: session } = useSession();
  const router = useRouter();
  const user = session?.user;

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [location, setLocation] = useState("");
  const [pinCode, setPinCode] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [time, setTime] = useState("");
  const [socialLink, setSocialLink] = useState("");
  const [category, setCategory] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      toast.error("You must be logged in to create an event.");
      router.push("/");
      return;
    }
    try {
      setLoading(true);
      await addDoc(collection(db, "posts"), {
        id: uuidv4(),
        title,
        desc,
        location,
        pinCode,
        date: date ? date.toISOString() : null,
        time,
        socialLink: socialLink.trim() === "" ? "Not provided" : socialLink,
        category,
        user,
        createdAt: serverTimestamp(),
        interested: [],
      });
      toast.success("Event has been created 🎉", {
        description: `${format(date || new Date(), "PPP")} at ${time || "TBA"}`,
      });
      setTitle("");
      setDesc("");
      setLocation("");
      setPinCode("");
      setDate(new Date());
      setTime("");
      setSocialLink("");
      setCategory("");
    } catch (err) {
      console.error("Error adding event: ", err);
      toast.error("Failed to create event ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 pt-10">
      <Card className="w-full max-w-4xl backdrop-blur-xl bg-white/10 dark:bg-black/20 border border-white/20 dark:border-gray-800 shadow-lg rounded-xl mt-8">
        <CardHeader>
          <CardTitle className="text-center text-lg font-semibold text-foreground font-mono">
            Create Event
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {/* Title */}
            <div className="flex flex-col space-y-3">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Type className="w-3 h-3" /> Title
              </label>
              <Input
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="h-10 px-2 text-sm bg-white/20 dark:bg-black/30 text-foreground placeholder:text-gray-400"
              />
            </div>

            {/* Category */}
            <div className="flex flex-col space-y-3">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Tags className="w-3 h-3 text-orange-500" /> Category
              </label>
              <Select onValueChange={setCategory} value={category}>
                <SelectTrigger className="h-10 w-full text-sm bg-white/20 dark:bg-black/30 text-foreground border border-white/30 dark:border-gray-700">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-background/90 backdrop-blur-md border border-white/20 dark:border-gray-700 rounded-lg">
                  <SelectItem value="fitness">🏋️ Fitness</SelectItem>
                  <SelectItem value="yoga">🧘 Yoga</SelectItem>
                  <SelectItem value="trekking">⛰️ Trekking</SelectItem>
                  <SelectItem value="sports">⚽ Sports</SelectItem>
                  <SelectItem value="dance">💃 Dance</SelectItem>
                  <SelectItem value="music">🎵 Music</SelectItem>
                  <SelectItem value="gaming">🎮 Gaming</SelectItem>
                  <SelectItem value="comedy">😂 Comedy</SelectItem>
                  <SelectItem value="others">✨ Others</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Description */}
            <div className="flex flex-col space-y-3 md:col-span-2">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <FileText className="w-3 h-3" /> Description
              </label>
              <Textarea
                placeholder="Enter description"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
                required
                className="h-24 px-2 text-sm bg-white/20 dark:bg-black/30 text-foreground placeholder:text-gray-400"
              />
            </div>

            {/* Location */}
            <div className="flex flex-col space-y-3">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3 text-red-500" /> Location
              </label>
              <Input
                placeholder="Enter location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                required
                className="h-10 px-2 text-sm bg-white/20 dark:bg-black/30 text-foreground placeholder:text-gray-400"
              />
            </div>

            {/* Pin Code */}
            <div className="flex flex-col space-y-3">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3 text-yellow-500" /> Pin Code / ZIP
                Code
              </label>
              <Input
                type="text"
                placeholder="Enter pin code"
                value={pinCode}
                onChange={(e) => setPinCode(e.target.value)}
                required
                className="h-10 px-2 text-sm bg-white/20 dark:bg-black/30 text-foreground placeholder:text-gray-400"
              />
            </div>

            {/* Date */}
            <div className="flex flex-col space-y-3">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <CalendarIcon className="w-3 h-3 text-blue-500" /> Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full h-10 px-2 justify-start text-sm font-normal bg-white/20 dark:bg-black/30 text-foreground border border-white/30 dark:border-gray-700",
                      !date && "text-gray-400"
                    )}
                  >
                    {date ? format(date, "PPP", { locale: enUS }) : "Pick date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    locale={enUS}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Time */}
            <div className="flex flex-col space-y-3">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <Clock className="w-3 h-3 text-green-500" /> Time
              </label>
              <Input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
                className="h-10 px-2 text-sm bg-white/20 dark:bg-black/30 text-foreground placeholder:text-gray-400"
              />
            </div>

            {/* Social Link */}
            <div className="flex flex-col space-y-3">
              <label className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                <LinkIcon className="w-3 h-3 text-purple-500" /> Social Link
              </label>
              <Input
                type="url"
                placeholder="Optional link"
                value={socialLink}
                onChange={(e) => setSocialLink(e.target.value)}
                className="h-10 px-2 text-sm bg-white/20 dark:bg-black/30 text-foreground placeholder:text-gray-400"
              />
            </div>

            {/* Submit Button */}
            <div className="md:col-span-2 mt-4">
              <Button
                type="submit"
                className="w-full h-10 text-sm font-medium bg-foreground text-background hover:opacity-90"
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-1">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating...
                  </span>
                ) : (
                  "Post New Event"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
