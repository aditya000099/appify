"use client";
import { useState, useEffect } from "react";

const BrowserCheck = () => {
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    const checkBrowser = () => {
      const userAgent = navigator.userAgent.toLowerCase();

      // Check Opera first since it includes Chrome in its UA
      const isOpera = /opera|opr/i.test(userAgent);
      // Only consider it Chrome if it's not Opera and not Edge
      const isChrome =
        !isOpera &&
        /chrome|chromium/i.test(userAgent) &&
        !/edg/i.test(userAgent);
      const isFirefox = /firefox/i.test(userAgent);
      const isEdge = /edg/i.test(userAgent);

      console.log("Browser checks:", { isChrome, isFirefox, isEdge, isOpera });

      // Show popup for Opera or any other non-recommended browser
      if (isOpera || (!isChrome && !isFirefox && !isEdge)) {
        console.log("Setting popup to show");
        setShowPopup(true);
      }
    };

    checkBrowser();
  }, []);

  return showPopup ? (
    <div className="fixed bottom-4 right-4 bg-zinc-900/95 border border-zinc-800 p-4 rounded-lg shadow-lg z-[9999] max-w-sm backdrop-blur-sm">
      <div className="flex flex-col gap-3">
        <h3 className="font-semibold text-white">Browser Recommendation</h3>
        <p className="text-zinc-200">
          For the best experience, we recommend using Chrome, Firefox, or Edge.
        </p>
        <button
          onClick={() => setShowPopup(false)}
          className="self-end px-4 py-2 bg-blue-600/20 hover:bg-blue-600/30 rounded-md text-white text-sm transition-all"
        >
          Got it
        </button>
      </div>
    </div>
  ) : null;
};

export default BrowserCheck;
