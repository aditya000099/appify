import Image from "next/image";
import Link from "next/link";

export default function FeaturedApps({ apps }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {apps.map((app) => (
        <Link
          key={app.id}
          href={`/apps/${app.id}`}
          className="bg-gray-800 rounded-lg overflow-hidden hover:transform hover:scale-105 transition-all duration-300"
        >
          <div className="relative h-48">
            <Image
              src={app.iconUrl}
              alt={app.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="text-xl font-semibold text-white mb-2">
              {app.name}
            </h3>
            <p className="text-gray-400 text-sm mb-2">{app.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">
                {app._count.downloads} downloads
              </span>
              <span className="text-sm text-blue-400">
                {app.price === 0 ? "Free" : `$${app.price}`}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
