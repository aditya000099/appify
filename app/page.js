import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]">
      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            Welcome to Appify
          </h1>
          <p className="text-xl text-gray-300">
            Your trusted platform for discovering and distributing amazing
            applications
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          <Link
            href="/apps"
            className="p-6 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
          >
            <h2 className="text-2xl font-bold mb-4">Discover Apps →</h2>
            <p className="text-gray-400">
              Browse through our collection of carefully curated applications
            </p>
          </Link>

          <Link
            href="/dashboard"
            className="p-6 border border-gray-800 rounded-lg hover:border-gray-700 transition-colors"
          >
            <h2 className="text-2xl font-bold mb-4">Developer Dashboard →</h2>
            <p className="text-gray-400">
              Publish and manage your applications
            </p>
          </Link>
        </div>

        <div className="text-center">
          <Link
            href="/auth/register"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-full transition-colors"
          >
            Get Started
          </Link>
        </div>
      </main>
    </div>
  );
}
