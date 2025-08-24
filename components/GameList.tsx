"use client";
import React from "react";
import {
  Dumbbell,
  Music,
  Gamepad2,
  Laugh,
  Palette,
  UtensilsCrossed,
  Cpu,
} from "lucide-react";
import { GiMeditation, GiHiking, GiBallerinaShoes } from "react-icons/gi";
import { FaFootballBall } from "react-icons/fa";

const categories = [
  {
    name: "Fitness",
    icon: <Dumbbell className="w-5 h-5" />,
    hover: "text-green-600",
  },
  {
    name: "Yoga",
    icon: <GiMeditation className="w-5 h-5" />,
    hover: "text-purple-500",
  },
  {
    name: "Trekking",
    icon: <GiHiking className="w-5 h-5" />,
    hover: "text-amber-600",
  },
  {
    name: "Sports",
    icon: <FaFootballBall className="w-5 h-5" />,
    hover: "text-blue-600",
  },
  {
    name: "Dance",
    icon: <GiBallerinaShoes className="w-5 h-5" />,
    hover: "text-pink-500",
  },
  { name: "Music", icon: <Music className="w-5 h-5" />, hover: "text-red-500" },
  {
    name: "Gaming",
    icon: <Gamepad2 className="w-5 h-5" />,
    hover: "text-yellow-500",
  },
  {
    name: "Comedy",
    icon: <Laugh className="w-5 h-5" />,
    hover: "text-orange-500",
  },
  {
    name: "Art",
    icon: <Palette className="w-5 h-5" />,
    hover: "text-indigo-500",
  },
  {
    name: "Food",
    icon: <UtensilsCrossed className="w-5 h-5" />,
    hover: "text-rose-500",
  },
  { name: "Tech", icon: <Cpu className="w-5 h-5" />, hover: "text-cyan-500" },
];

type Props = {
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
};

const CategoryList = ({ selectedCategory, setSelectedCategory }: Props) => {
  const handleClick = (name: string) => {
    if (selectedCategory === name) {
      setSelectedCategory(""); // deselect if already selected
    } else {
      setSelectedCategory(name);
    }
  };

  return (
    <div className="w-full flex justify-center mb-10">
      <div className="glass flex gap-6 md:gap-10 px-6 py-4 rounded-2xl shadow-md overflow-x-auto">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <div
              key={cat.name}
              onClick={() => handleClick(cat.name)}
              className={`group flex flex-col items-center justify-center space-y-1 cursor-pointer transition-transform duration-200
                ${isSelected ? "scale-105" : "hover:scale-105"}
              `}
            >
              <div
                className={`p-2 rounded-full bg-white dark:bg-gray-900 shadow-sm transition-colors duration-200
                  ${isSelected ? cat.hover : "group-hover:" + cat.hover}`}
              >
                {cat.icon}
              </div>
              <span
                className={`text-sm font-medium transition-colors duration-200
                  ${isSelected ? cat.hover : "group-hover:" + cat.hover}`}
              >
                {cat.name}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryList;
