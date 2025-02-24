import Image from "next/image";
import prisma from "@/prisma/client";
import Navbar from "@/app/components/navbar";
import { AuroraText } from "@/app/components/ui/AuroraText";

async function getAppDetails(id) {
  const app = await prisma.app.findUnique({
    where: { id: id },
    include: {
      developer: true,
      _count: {
        select: { downloads: true },
      },
    },
  });
  return app;
}

export default async function AppDetailsPage({ params }) {
  const app = await getAppDetails(params.id);

  if (!app) {
    return <div className="p-8">App not found</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      <main className="flex-1 relative mt-10">
        {/* Background pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_90%,transparent_100%)]" />

        <div className="relative container mx-auto p-8 mt-16">
          <div className="flex flex-col gap-8">
            <div className="flex items-start gap-6">
              <Image
                src={app.iconUrl || "/placeholder-icon.png"}
                alt={app.name}
                width={128}
                height={128}
                className="rounded-2xl"
              />
              <div>
                <AuroraText as="h1" className="text-3xl font-bold mb-2">
                  {app.name}
                </AuroraText>
                <p className="text-zinc-400">{app.developer.name}</p>
                <div className="mt-4 flex gap-4">
                  <button className="px-8 py-3 rounded-full bg-blue-600/20 hover:bg-blue-600/30 text-white font-semibold transition-all border border-blue-600/50">
                    Download
                  </button>
                  <button className="px-8 py-3 rounded-full bg-purple-600/20 hover:bg-purple-600/30 text-white font-semibold transition-all border border-purple-600/50">
                    Share
                  </button>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">
                  Description
                </h2>
                <p className="text-zinc-400">{app.description}</p>
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">
                  Details
                </h2>
                <div className="space-y-2 text-zinc-400">
                  <p>Version: {app.version}</p>
                  <p>Category: {app.category}</p>
                  <p>Downloads: {app._count.downloads}</p>
                  <p>
                    Last Updated: {new Date(app.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {app.screenshots && (
              <div>
                <h2 className="text-xl font-semibold mb-4 text-white">
                  Screenshots
                </h2>
                <div className="flex gap-4 overflow-x-auto pb-4">
                  {app.screenshots.map((screenshot, index) => (
                    <Image
                      key={index}
                      src={screenshot}
                      alt={`${app.name} screenshot ${index + 1}`}
                      width={300}
                      height={200}
                      className="rounded-lg"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
