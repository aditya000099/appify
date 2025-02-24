"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { FiDownload, FiStar, FiPackage, FiPlus } from "react-icons/fi";
import Navbar from "../components/navbar";

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [apps, setApps] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
    }

    if (status === "authenticated") {
      fetchApps();
    }
  }, [status]);

  const fetchApps = async () => {
    try {
      const response = await fetch("/api/apps");
      const data = await response.json();
      setApps(data.apps);
      setAnalytics(data.analytics);
    } catch (error) {
      console.error("Error fetching apps:", error);
    } finally {
      setLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-900/30 p-8">
      <Navbar />
      {/* Analytics Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 mt-20 p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 p-6 rounded-xl backdrop-blur-xl border border-white/10"
        >
          <div className="flex items-center gap-4">
            <FiPackage className="text-purple-400 text-2xl" />
            <div>
              <p className="text-gray-400">Total Apps</p>
              <h3 className="text-2xl font-bold text-white">
                {analytics?.totalApps || 0}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/5 p-6 rounded-xl backdrop-blur-xl border border-white/10"
        >
          <div className="flex items-center gap-4">
            <FiDownload className="text-green-400 text-2xl" />
            <div>
              <p className="text-gray-400">Total Downloads</p>
              <h3 className="text-2xl font-bold text-white">
                {analytics?.totalDownloads || 0}
              </h3>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/5 p-6 rounded-xl backdrop-blur-xl border border-white/10"
        >
          <div className="flex items-center gap-4">
            <FiStar className="text-yellow-400 text-2xl" />
            <div>
              <p className="text-gray-400">Average Rating</p>
              <h3 className="text-2xl font-bold text-white">
                {analytics?.averageRating.toFixed(1) || "0.0"}
              </h3>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Actions */}
      <div className="flex justify-between items-center mb-6 px-12">
        <h2 className="text-2xl font-bold text-white">Your Apps</h2>
        <Link
          href="/admin/apps/new"
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <FiPlus /> New App
        </Link>
      </div>

      {/* Apps List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 px-12">
        {apps.map((app) => (
          <motion.div
            key={app.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/5 rounded-xl backdrop-blur-xl border border-white/10 overflow-hidden"
          >
            <div className="flex items-center p-4">
              <img
                src={app.iconUrl}
                alt={app.name}
                className="w-16 h-16 rounded-xl mr-4"
              />
              <div>
                <h3 className="text-lg font-semibold text-white">{app.name}</h3>
                <p className="text-gray-400 text-sm">Version {app.version}</p>
                <p className="text-gray-400 text-sm">
                  Status:{" "}
                  <span
                    className={`${
                      app.approvalStatus === "APPROVED"
                        ? "text-green-400"
                        : app.approvalStatus === "REJECTED"
                        ? "text-red-400"
                        : "text-yellow-400"
                    }`}
                  >
                    {app.approvalStatus}
                  </span>
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
