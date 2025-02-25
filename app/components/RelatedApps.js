import Image from "next/image";
import Link from "next/link";

export default function RelatedApps({ apps }) {
  return (
    <div className="w-full">
      <h2 className="text-xl font-semibold mb-6 text-white">Related Apps</h2>
      <div className="flex flex-col gap-4">
        {apps.map((app) => (
          <Link key={app.id} href={`/apps/${app.id}`} className="group block">
            <div className="bg-zinc-800/30 rounded-xl p-4 hover:bg-zinc-800/50 transition-all">
              <div className="flex gap-4">
                {/* App Icon */}
                <div className="relative w-16 h-16 flex-shrink-0">
                  <div className="relative w-full h-full rounded-xl overflow-hidden">
                    <Image
                      src={app.iconUrl}
                      alt={app.name}
                      width={64}
                      height={64}
                      className="object-cover"
                    />
                  </div>
                </div>

                {/* App Info */}
                <div className="flex-1">
                  <h3 className="text-white font-medium">{app.name}</h3>
                  <p className="text-zinc-400 text-sm mt-1 line-clamp-1">
                    {app.description}
                  </p>

                  {/* Stats */}
                  <div className="flex gap-2 mt-2 text-sm">
                    <span className="text-blue-400">
                      {app._count?.downloads || "1.2K"} ⇲
                    </span>
                    <span className="text-blue-400">
                      {app.rating || "4.5"} ★
                    </span>
                    <span className="text-blue-400">
                      {app.price === 0 ? "Free" : `$${app.price}`}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
