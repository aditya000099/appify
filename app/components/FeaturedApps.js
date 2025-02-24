import Image from "next/image";
import Link from "next/link";

export default function FeaturedApps({ apps }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 p-4">
      {apps.map((app) => (
        <Link key={app.id} href={`/apps/${app.id}`} className="group block">
          <div className="flex flex-col items-center">
            {/* Image Container */}
            <div className="relative w-64 h-64 mb-4">
              <div className="relative w-full h-full rounded-2xl overflow-hidden bg-zinc-800 shadow-lg">
                <Image
                  src={app.iconUrl}
                  alt={app.name}
                  width={12000}
                  height={12000}
                  className="object-cover transform group-hover:scale-105 transition-all duration-500 ease-in-out"
                />
                {/* Featured Tag - Now inside image */}
                <div className="absolute top-3 right-3 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium shadow-lg flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  Featured
                </div>
              </div>
            </div>

            {/* App Info - Width matched to image */}
            <div className="w-64 text-left mb-3">
              <h3 className="text-xl font-semibold text-white">{app.name}</h3>
              <p className="text-zinc-400 text-sm mt-1 line-clamp-2">
                {app.description}
              </p>
            </div>

            {/* Stats - Width matched to image */}
            <div className="w-64 flex justify-between items-center text-sm">
              <div className="flex gap-2">
                <div className="rounded-full bg-zinc-800/70 px-3 py-1">
                  <span className="text-blue-400 font-medium">
                    {app._count?.downloads || "1.2K"} ⇲
                  </span>
                </div>
                <div className="rounded-full bg-zinc-800/70 px-3 py-1">
                  <span className="text-blue-400 font-medium">
                    {app.rating || "4.5"} ★
                  </span>
                </div>
              </div>
              <div className="rounded-full bg-blue-500/20 px-3 py-1">
                <span className="text-blue-400 font-medium">
                  {app.price === 0 ? "Free" : `$${app.price}`}
                </span>
              </div>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
