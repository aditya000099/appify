"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Category } from "@prisma/client";
import { storage, BUCKET_ID } from "@/lib/appwrite";
import { ID } from "appwrite";
import { toast } from "react-hot-toast";
import { FiUpload } from "react-icons/fi";

export default function NewAppPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  console.log("Session status:", status);
  console.log("Session data:", session);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "OTHER",
    version: "",
    price: 0,
    apkFileUrl: "",
    iconUrl: "",
    screenshots: [],
  });
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    if (status === "unauthenticated") {
      console.log("User not authenticated, redirecting...");
      router.push("/auth");
    }
  }, [status, router]);

  const validateForm = () => {
    const errors = {};

    // Basic validations
    if (!formData.name.trim()) errors.name = "App name is required";
    if (!formData.description.trim())
      errors.description = "Description is required";
    if (formData.description.length < 50)
      errors.description = "Description must be at least 50 characters";
    if (!formData.version.match(/^\d+\.\d+(\.\d+)?$/))
      errors.version = "Invalid version format";
    if (formData.price < 0) errors.price = "Price cannot be negative";

    // File validations - removed screenshots requirement
    if (!formData.apkFileUrl) errors.apk = "APK file is required";
    if (!formData.iconUrl) errors.icon = "App icon is required";

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleFileUpload = async (file, type) => {
    console.log(`Uploading ${type} file:`, file.name);
    try {
      // File size validations
      const maxSizes = {
        apk: 100 * 1024 * 1024, // 100MB
        icon: 2 * 1024 * 1024, // 2MB
        screenshot: 5 * 1024 * 1024, // 5MB
      };

      if (file.size > maxSizes[type]) {
        throw new Error(
          `File too large. Maximum size for ${type}: ${
            maxSizes[type] / 1024 / 1024
          }MB`
        );
      }

      // Basic file validation
      if (type === "apk" && !file.name.endsWith(".apk")) {
        throw new Error("Please upload a valid APK file");
      }

      if (
        (type === "icon" || type === "screenshot") &&
        !file.type.startsWith("image/")
      ) {
        throw new Error("Please upload a valid image file");
      }

      const fileId = ID.unique();
      const response = await storage.createFile(BUCKET_ID, fileId, file);
      const fileUrl = storage.getFileView(BUCKET_ID, fileId);
      console.log(`${type} uploaded successfully:`, fileUrl);

      if (type === "apk") {
        setFormData((prev) => ({
          ...prev,
          apkFileUrl: fileUrl,
        }));
        toast.success("APK file uploaded successfully");
      } else if (type === "icon") {
        setFormData((prev) => ({ ...prev, iconUrl: fileUrl }));
        toast.success("Icon uploaded successfully");
      } else if (type === "screenshot") {
        setFormData((prev) => ({
          ...prev,
          screenshots: [...prev.screenshots, fileUrl],
        }));
        toast.success("Screenshot added successfully");
      }

      // Clear validation error for this field after successful upload
      setValidationErrors((prev) => ({ ...prev, [type]: undefined }));
    } catch (error) {
      setValidationErrors((prev) => ({ ...prev, [type]: error.message }));
      toast.error(`Error uploading ${type}: ${error.message}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submission started");
    console.log("Current form data:", formData);

    setIsSubmitting(true);

    try {
      // Validate form
      if (!validateForm()) {
        toast.error("Please fix the errors before submitting");
        setIsSubmitting(false);
        return;
      }

      // Check developer status again before submission
      //   const statusCheck = await fetch("/api/developer/check");
      //   if (!statusCheck.ok) {
      //     throw new Error("Developer status check failed");
      //   }

      if (!formData.apkFileUrl || !formData.iconUrl) {
        throw new Error("Please upload APK and icon files");
      }

      console.log("Submitting to API...");
      const response = await fetch("/api/apps", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("API response:", data);

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit app");
      }

      toast.success("App submitted successfully");
      router.push("/admin");
    } catch (error) {
      toast.error(error.message);
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (status === "loading") {
    console.log("Loading session...");
    return <div>Loading...</div>;
  }

  if (status !== "authenticated") {
    router.push("/auth");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black to-purple-900/30 p-8">
      <div className="max-w-3xl mx-auto bg-white/5 p-8 rounded-xl backdrop-blur-xl border border-white/10">
        <h2 className="text-2xl font-bold text-white mb-6">Submit New App</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                App Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  setValidationErrors((prev) => ({ ...prev, name: undefined }));
                }}
                className={`w-full p-2 rounded-lg bg-white/5 border ${
                  validationErrors.name
                    ? "border-red-500"
                    : "border-gray-300/10"
                } text-white`}
              />
              {validationErrors.name && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.name}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Category <span className="text-red-500">*</span>
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full p-2 rounded-lg bg-white/5 border border-gray-300/10 text-white"
              >
                {Object.values(Category).map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                required
                value={formData.description}
                onChange={(e) => {
                  setFormData({ ...formData, description: e.target.value });
                  setValidationErrors((prev) => ({
                    ...prev,
                    description: undefined,
                  }));
                }}
                className={`w-full p-2 rounded-lg bg-white/5 border ${
                  validationErrors.description
                    ? "border-red-500"
                    : "border-gray-300/10"
                } text-white h-32`}
              />
              {validationErrors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Price
              </label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formData.price}
                onChange={(e) => {
                  setFormData({
                    ...formData,
                    price: parseFloat(e.target.value),
                  });
                  setValidationErrors((prev) => ({
                    ...prev,
                    price: undefined,
                  }));
                }}
                className={`w-full p-2 rounded-lg bg-white/5 border ${
                  validationErrors.price
                    ? "border-red-500"
                    : "border-gray-300/10"
                } text-white`}
              />
              {validationErrors.price && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.price}
                </p>
              )}
            </div>
          </div>

          {/* Version Field */}
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-1">
              Version <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              placeholder="1.0.0"
              pattern="^\d+\.\d+(\.\d+)?$"
              value={formData.version}
              onChange={(e) => {
                setFormData({ ...formData, version: e.target.value });
                setValidationErrors((prev) => ({
                  ...prev,
                  version: undefined,
                }));
              }}
              className={`w-full p-2 rounded-lg bg-white/5 border ${
                validationErrors.version
                  ? "border-red-500"
                  : "border-gray-300/10"
              } text-white`}
            />
            <p className="text-xs text-gray-400 mt-1">
              Format: X.Y.Z (e.g., 1.0.0)
            </p>
            {validationErrors.version && (
              <p className="text-red-500 text-sm mt-1">
                {validationErrors.version}
              </p>
            )}
          </div>

          {/* File Uploads */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                APK File <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept=".apk"
                onChange={(e) => handleFileUpload(e.target.files[0], "apk")}
                className={`w-full p-2 rounded-lg bg-white/5 border ${
                  validationErrors.apk ? "border-red-500" : "border-gray-300/10"
                } text-white`}
              />
              {formData.apkFileUrl && (
                <p className="text-green-400 text-sm mt-1">
                  ✓ APK uploaded successfully
                </p>
              )}
              {validationErrors.apk && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.apk}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                App Icon <span className="text-red-500">*</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e.target.files[0], "icon")}
                className={`w-full p-2 rounded-lg bg-white/5 border ${
                  validationErrors.icon
                    ? "border-red-500"
                    : "border-gray-300/10"
                } text-white`}
              />
              {formData.iconUrl && (
                <div className="mt-2">
                  <img
                    src={formData.iconUrl}
                    alt="App Icon"
                    className="w-16 h-16 rounded"
                  />
                </div>
              )}
              {validationErrors.icon && (
                <p className="text-red-500 text-sm mt-1">
                  {validationErrors.icon}
                </p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-200 mb-1">
                Screenshots
                <span className="text-xs text-gray-400 ml-2">(Optional)</span>
              </label>
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => {
                  Array.from(e.target.files).forEach((file) => {
                    handleFileUpload(file, "screenshot");
                  });
                }}
                className="w-full p-2 rounded-lg bg-white/5 border border-gray-300/10 text-white"
              />
              {formData.screenshots.length > 0 && (
                <div className="mt-2 flex gap-2 overflow-x-auto">
                  {formData.screenshots.map((url, index) => (
                    <img
                      key={index}
                      src={url}
                      alt={`Screenshot ${index + 1}`}
                      className="h-20 rounded"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full bg-purple-600 hover:bg-purple-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2
              ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? (
              <>Submitting...</>
            ) : (
              <>
                Submit App <FiUpload />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
