import { Suspense } from "react";
import prisma from "@/prisma/client";
import Navbar from "@/app/components/navbar";
import FeaturedApps from "@/app/components/FeaturedApps";

async function getCategoryApps(categoryId) {
  const apps = await prisma.app.findMany({
    where: {
      category: categoryId,
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

export default async function CategoryPage({ params }) {
  const apps = await getCategoryApps(params.id);

  return (
    <div className="min-h-screen">
      <Navbar className="fixed top-0 left-0 right-0 z-50" />
      <main className="container mx-auto px-4 py-8 pt-32">
        <h1 className="text-3xl font-bold mb-6">Category Apps</h1>

        {apps.length === 0 ? (
          <p className="text-zinc-400 text-center py-12">
            No apps found in this category.
          </p>
        ) : (
          <Suspense fallback={<div>Loading...</div>}>
            <FeaturedApps apps={apps} />
          </Suspense>
        )}
      </main>
    </div>
  );
}
