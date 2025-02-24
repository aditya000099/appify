import Image from "next/image";
import prisma from "@/prisma/client";
import Navbar from "@/app/components/navbar";
import { AuroraText } from "@/app/components/ui/AuroraText";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import ReviewForm from "@/app/components/ReviewForm";

async function getAppDetails(id) {
  const app = await prisma.app.findUnique({
    where: { id: id },
    include: {
      developer: true,
      reviews: {
        include: {
          user: {
            select: {
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: { downloads: true },
      },
    },
  });
  return app;
}

export default async function AppDetailsPage({ params }) {
  const session = await getServerSession(authOptions);
  const app = await getAppDetails(params.id);

  if (!app) {
    return <div className="p-8">App not found</div>;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col overflow-x-hidden">
      <Navbar />

      <main className="flex-1 relative mt-20">
        {/* Background pattern with radial gradients */}
        <div className="fixed inset-0 z-0">
          <div className="absolute left-[-10%] top-[10%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
          <div className="absolute right-[-10%] top-[10%] h-[400px] w-[400px] rounded-full bg-[radial-gradient(circle_farthest-side,rgba(255,0,182,.15),rgba(255,255,255,0))]"></div>
        </div>

        <div className="relative z-10 container mx-auto p-8 mt-16">
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
                <h1 as="h1" className="text-3xl font-bold mb-2">
                  {app.name}
                </h1>
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

            {/* Reviews Section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4 text-white">Reviews</h2>

              {session ? (
                <div className="mb-8">
                  <h3 className="text-lg font-medium text-white mb-4">
                    Add a Review
                  </h3>
                  <ReviewForm appId={app.id} />
                </div>
              ) : (
                <p className="text-zinc-400 mb-8">
                  Please log in to leave a review.
                </p>
              )}

              <div className="space-y-6">
                {app.reviews.length === 0 ? (
                  <p className="text-zinc-400">No reviews yet.</p>
                ) : (
                  app.reviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-zinc-800/50 p-4 rounded-lg"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="text-white font-medium">
                            {review.user.name || review.user.email}
                          </p>
                          <div className="text-yellow-500">
                            {"★".repeat(review.rating)}
                            {"☆".repeat(5 - review.rating)}
                          </div>
                        </div>
                        <span className="text-zinc-500 text-sm">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      {review.comment && (
                        <p className="text-zinc-400">{review.comment}</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
