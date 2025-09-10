import React from 'react'


function UploadStatusBox({ status, progress, message }) {
    if (status === "idle") return null;
  
    return (
      <div className="mt-6 p-4 rounded-2xl border bg-gray-50 shadow-sm">
        {status === "uploading" && (
          <>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
              <span className="text-sm">Uploading…</span>
            </div>
            <div className="mt-3 h-2 bg-gray-200 rounded-2xl overflow-hidden">
              <div
                className="h-full bg-black transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <div className="mt-1 text-xs text-gray-600">{progress}%</div>
          </>
        )}
  
        {status === "success" && (
          <div className="flex items-center gap-2 text-green-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"/>
            </svg>
            <span className="text-sm">{message || "Upload completed"}</span>
          </div>
        )}
  
        {status === "error" && (
          <div className="flex items-center gap-2 text-red-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <span className="text-sm">{message || "Upload failed"}</span>
          </div>
        )}
  
        {status === "canceled" && (
          <div className="flex items-center gap-2 text-gray-600">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            <span className="text-sm">{message || "Upload canceled"}</span>
          </div>
        )}
      </div>
    );
  }
  

export default UploadStatusBox
