import Image from "next/image";
import Link from "next/link";
import { BsSearch } from "react-icons/bs";
import Navbar from "./components/navbar";
import FeaturedApps from "./components/FeaturedApps";
import CategoryGrid from "./components/CategoryGrid";
import SearchBar from "./components/SearchBar";
import { AuroraText } from "./components/ui/AuroraText";
import BrowserCheck from "./components/BrowserCheck";
import prisma from "@/prisma/client";

async function getFeaturedApps() {
  const apps = await prisma.app.findMany({
    take: 8,
    include: {
      developer: true,
      _count: {
        select: { downloads: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return apps;
}

export default async function Home() {
  const featuredApps = await getFeaturedApps();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <BrowserCheck />

      <main className="flex-1 relative mt-10">
        {/* Background pattern lines wala */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_90%,transparent_100%)]" />

        <div className="relative">
          <section className="pt-20 pb-32">
            <div className="container mx-auto px-4">
              <div className="text-center max-w-4xl mx-auto">
                <span className="text-5xl md:text-7xl font-bold mb-6 bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text tracking-tighter text-transparent">
                  Discover Amazing{" "}
                </span>
                <AuroraText
                  as="h1"
                  className="text-5xl md:text-7xl font-bold mb-6"
                >
                  Apps
                </AuroraText>
                <p className="text-xl text-zinc-300 mb-8  bg-[linear-gradient(180deg,_#FFF_0%,_rgba(255,_255,_255,_0.00)_202.08%)] bg-clip-text tracking-tighter text-transparent">
                  Your trusted platform for finding and distributing exceptional
                  applications
                </p>

                <SearchBar />

                <div className="mt-8 flex flex-wrap gap-4 justify-center">
                  <Link
                    href="/apps"
                    className="px-8 py-3 rounded-full bg-blue-600/20 hover:bg-blue-600/30 text-white font-semibold transition-all border border-blue-600/50"
                  >
                    Browse Apps
                  </Link>
                  <Link
                    href="/admin"
                    className="px-8 py-3 rounded-full bg-purple-600/20 hover:bg-purple-600/30 text-white font-semibold transition-all border border-purple-600/50"
                  >
                    Publish Your App
                  </Link>
                </div>
              </div>
            </div>
          </section>

          <section className="py-16 bg-black/20 ">
            <div className="container mx-auto px-4">
              <AuroraText
                as="h2"
                className="text-3xl font-bold mb-12 text-center"
              >
                Featured Apps
              </AuroraText>
              <FeaturedApps apps={featuredApps} />
            </div>
          </section>

          <section className="py-16">
            <div className="container mx-auto px-4">
              <AuroraText as="h2" className="text-3xl font-bold mb-8">
                Browse Categories
              </AuroraText>
              <CategoryGrid />
            </div>
          </section>

          <footer className="border-t border-zinc-800/50 py-8 text-zinc-400 text-center">
            <div className="container mx-auto px-4">
              <p>© {new Date().getFullYear()} Appifyy. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </main>
    </div>
  );
}
