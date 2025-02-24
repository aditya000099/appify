import Link from "next/link";
import {
  FaGamepad,
  FaBriefcase,
  FaTools,
  FaFilm,
  FaGraduationCap,
  FaEllipsisH,
} from "react-icons/fa";

const categories = [
  { id: "GAMES", name: "Games", icon: FaGamepad },
  { id: "PRODUCTIVITY", name: "Productivity", icon: FaBriefcase },
  { id: "UTILITIES", name: "Utilities", icon: FaTools },
  { id: "ENTERTAINMENT", name: "Entertainment", icon: FaFilm },
  { id: "EDUCATION", name: "Education", icon: FaGraduationCap },
  { id: "OTHER", name: "Other", icon: FaEllipsisH },
];

export default function CategoryGrid() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {categories.map((category) => (
        <Link
          key={category.id}
          href={`/apps/category/${category.id}`}
          className="flex flex-col items-center p-6 bg-zinc-900 rounded-lg hover:bg-zinc-800 transition-colors"
        >
          <category.icon className="text-4xl text-blue-400 mb-3" />
          <span className="text-white font-medium">{category.name}</span>
        </Link>
      ))}
    </div>
  );
}
