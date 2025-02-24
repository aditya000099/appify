import { Suspense } from "react";
import prisma from "@/prisma/client";
import { AuroraText } from "@/app/components/ui/AuroraText";
import Navbar from "@/app/components/navbar";
import FeaturedApps from "@/app/components/FeaturedApps"; // Using FeaturedApps for now

async function getSearchResults(query) {
  const apps = await prisma.app.findMany({
    where: {
      OR: [
        { name: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
      ],
    },
    include: {
      developer: true,
      _count: {
        select: { downloads: true },
      },
    },
  });
  return apps;
}

export default async function SearchPage({ searchParams }) {
  const query = searchParams.q || "";
  const results = await getSearchResults(query);

  return (
    <div className="min-h-screen">
      <Navbar className="fixed top-0 left-0 right-0 z-50" />
      <main className="container mx-auto px-4 py-8 pt-32">
        <h1 as="h1" className="text-3xl font-bold mb-6">
          Search Results for "{query}"
        </h1>

        {results.length === 0 ? (
          <p className="text-zinc-400 text-center py-12">
            No apps found matching your search.
          </p>
        ) : (
          <Suspense fallback={<div>Loading...</div>}>
            <FeaturedApps apps={results} />{" "}
            {/* Using FeaturedApps instead of AppGrid */}
          </Suspense>
        )}
      </main>
    </div>
  );
}
