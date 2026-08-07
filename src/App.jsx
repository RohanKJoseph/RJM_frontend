 import React, { useState, useEffect } from "react";
import {
  Shield,
  Clock,
  Monitor,
  RefreshCcw,
  AlertCircle,
  Image as ImageIcon,
  Maximize2,
  X,
  Camera,
} from "lucide-react";

const API_URL = import.meta.env.VITE_API_BASE_URL;

const ActivityDashboard = () => {
  const [logs, setLogs] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);

  // --------------------------------------------------
  // Fetch activity logs
  // --------------------------------------------------

  const fetchLogs = async () => {
    setIsRefreshing(true);

    try {
      const response = await fetch(`${API_URL}/api/logs`);

      if (!response.ok) {
        throw new Error(`HTTP error: ${response.status}`);
      }

      const data = await response.json();

      setLogs(data);
    } catch (err) {
      console.error("Fetch failed:", err);
    } finally {
      setTimeout(() => setIsRefreshing(false), 600);
    }
  };

  // --------------------------------------------------
  // Load activity when dashboard opens
  // --------------------------------------------------

  useEffect(() => {
    fetchLogs();
  }, []);

  // --------------------------------------------------
  // Helpers
  // --------------------------------------------------

  const privateCount = logs.filter((log) => log.is_incognito).length;

  const screenshotCount = logs.filter(
    (log) => log.screenshot_id
  ).length;

  const getScreenshotUrl = (screenshotId) => {
    if (!screenshotId) return null;

    return `${API_URL}/api/screenshots/${screenshotId}`;
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return "--:--";

    return new Date(timestamp).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "";

    return new Date(timestamp).toLocaleDateString([], {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // --------------------------------------------------
  // UI
  // --------------------------------------------------

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 font-sans selection:bg-indigo-100">

      {/* --------------------------------------------------
          Top Navigation
      -------------------------------------------------- */}

      <nav className="sticky top-0 z-40 bg-white/70 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-200">
              <Shield className="text-white w-5 h-5" />
            </div>

            <span className="font-bold text-lg tracking-tight">
              GuardView
            </span>
          </div>

          <button
            onClick={fetchLogs}
            disabled={isRefreshing}
            title="Refresh activity"
            className="p-2 rounded-full hover:bg-slate-100 transition-all disabled:opacity-50"
          >
            <RefreshCcw
              size={20}
              className={`text-slate-500 ${
                isRefreshing ? "animate-spin" : ""
              }`}
            />
          </button>

        </div>
      </nav>

      {/* --------------------------------------------------
          Main
      -------------------------------------------------- */}

      <main className="max-w-5xl mx-auto p-6">

        {/* Quick Stats */}

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">

          {/* Total events */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Total Events
            </p>

            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold">
                {logs.length}
              </span>

              <span className="text-xs text-green-500 mb-1 font-medium">
                Windows
              </span>
            </div>
          </div>

          {/* Screenshots */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Screenshots
            </p>

            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-indigo-600">
                {screenshotCount}
              </span>

              <Camera
                size={16}
                className="text-indigo-500 mb-1.5"
              />
            </div>
          </div>

          {/* Private */}

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Private Sessions
            </p>

            <div className="flex items-end gap-2 mt-1">
              <span className="text-2xl font-bold text-red-600">
                {privateCount}
              </span>

              <AlertCircle
                size={16}
                className="text-red-500 mb-1.5"
              />
            </div>
          </div>

        </div>

        {/* --------------------------------------------------
            Section Header
        -------------------------------------------------- */}

        <div className="flex items-center justify-between mb-4 px-1">

          <h2 className="text-sm font-bold text-slate-500 uppercase tracking-widest">
            Live Activity Feed
          </h2>

          <div className="flex items-center gap-1.5">

            <span className="relative flex h-2 w-2">

              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />

              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />

            </span>

            <span className="text-[11px] font-medium text-slate-400">
              System Live
            </span>

          </div>
        </div>

        {/* --------------------------------------------------
            Timeline
        -------------------------------------------------- */}

        <div className="space-y-4">

          {logs.map((log, index) => {

            const screenshotUrl = getScreenshotUrl(
              log.screenshot_id
            );

            return (
              <div
                key={log._id || index}
                className="group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5"
              >

                {/* Screenshot */}

                {screenshotUrl && (

                  <div className="relative bg-slate-100 border-b border-slate-100">

                    <img
                      src={screenshotUrl}
                      alt={`Screenshot of ${log.window_title}`}
                      loading="lazy"
                      className="w-full max-h-[420px] object-contain bg-slate-100"
                    />

                    {/* Screenshot overlay */}

                    <div className="absolute top-3 right-3">

                      <button
                        onClick={() =>
                          setSelectedScreenshot({
                            url: screenshotUrl,
                            title: log.window_title,
                            timestamp: log.timestamp,
                            isIncognito: log.is_incognito,
                          })
                        }
                        className="flex items-center gap-1.5 bg-black/60 hover:bg-black/75 backdrop-blur-sm text-white px-3 py-2 rounded-lg transition"
                      >
                        <Maximize2 size={14} />

                        <span className="text-[11px] font-semibold">
                          View
                        </span>
                      </button>

                    </div>

                  </div>

                )}

                {/* Missing screenshot */}

                {!screenshotUrl && (

                  <div className="h-28 bg-slate-50 border-b border-slate-100 flex flex-col items-center justify-center text-slate-300">

                    <ImageIcon size={24} />

                    <span className="text-[11px] mt-2 font-medium">
                      Screenshot unavailable
                    </span>

                    {log.screenshot_error && (
                      <span
                        className="text-[10px] text-red-400 mt-1 max-w-md truncate px-4"
                        title={log.screenshot_error}
                      >
                        {log.screenshot_error}
                      </span>
                    )}

                  </div>

                )}

                {/* Event information */}

                <div className="p-4">

                  <div className="flex items-start gap-4">

                    <div
                      className={`mt-1 p-2 rounded-xl ${
                        log.is_incognito
                          ? "bg-red-50 text-red-600"
                          : "bg-indigo-50 text-indigo-600"
                      }`}
                    >
                      <Monitor size={18} />
                    </div>

                    <div className="flex-1 min-w-0">

                      <div className="flex items-start justify-between gap-2">

                        <p className="text-[14px] font-semibold text-slate-800 leading-tight truncate pr-4">
                          {log.window_title || "Unknown Window"}
                        </p>

                        {log.is_incognito && (
                          <span className="shrink-0 text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded-md uppercase">
                            Private
                          </span>
                        )}

                      </div>

                      {/* Event metadata */}

                      <div className="mt-2 flex flex-wrap items-center gap-3 text-slate-400">

                        <div className="flex items-center gap-1">

                          <Clock size={12} />

                          <span className="text-[11px] font-medium">
                            {formatTime(log.timestamp)}
                          </span>

                        </div>

                        <span className="text-slate-200">
                          •
                        </span>

                        <span className="text-[11px] font-medium">
                          {formatDate(log.timestamp)}
                        </span>

                        <span className="text-slate-200">
                          •
                        </span>

                        <span className="text-[11px] font-medium italic">
                          Active Window
                        </span>

                        {log.screenshot_id && (
                          <>
                            <span className="text-slate-200">
                              •
                            </span>

                            <div className="flex items-center gap-1 text-indigo-400">
                              <Camera size={11} />

                              <span className="text-[11px] font-medium">
                                Screenshot captured
                              </span>
                            </div>
                          </>
                        )}

                      </div>

                    </div>

                  </div>

                </div>

              </div>
            );
          })}

          {/* Empty state */}

          {logs.length === 0 && (

            <div className="py-20 flex flex-col items-center justify-center bg-white rounded-3xl border-2 border-dashed border-slate-200">

              <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">

                <Monitor className="text-slate-300" />

              </div>

              <p className="text-slate-400 text-sm font-medium">
                Waiting for laptop activity...
              </p>

            </div>

          )}

        </div>

      </main>

      {/* --------------------------------------------------
          Fullscreen Screenshot Modal
      -------------------------------------------------- */}

      {selectedScreenshot && (

        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-8"
          onClick={() => setSelectedScreenshot(null)}
        >

          <div
            className="relative max-w-7xl w-full max-h-full"
            onClick={(e) => e.stopPropagation()}
          >

            {/* Modal header */}

            <div className="flex items-center justify-between mb-3 text-white">

              <div className="min-w-0 pr-4">

                <div className="flex items-center gap-2">

                  <p className="font-semibold text-sm truncate">
                    {selectedScreenshot.title}
                  </p>

                  {selectedScreenshot.isIncognito && (
                    <span className="text-[9px] font-bold uppercase bg-red-600 px-2 py-0.5 rounded">
                      Private
                    </span>
                  )}

                </div>

                <p className="text-white/50 text-xs mt-1">
                  {formatDate(selectedScreenshot.timestamp)}
                  {" • "}
                  {formatTime(selectedScreenshot.timestamp)}
                </p>

              </div>

              <button
                onClick={() => setSelectedScreenshot(null)}
                className="shrink-0 w-9 h-9 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center transition"
              >
                <X size={20} />
              </button>

            </div>

            {/* Full screenshot */}

            <div className="bg-black rounded-xl overflow-hidden">

              <img
                src={selectedScreenshot.url}
                alt={selectedScreenshot.title}
                className="w-full max-h-[85vh] object-contain"
              />

            </div>

          </div>

        </div>

      )}

    </div>
  );
};

export default ActivityDashboard;
 
