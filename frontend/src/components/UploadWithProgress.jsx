import React, { useRef, useState } from "react";

/**
 * UploadWithProgress
 * - Tracks percentage via XMLHttpRequest upload progress events
 * - Shows status: idle → uploading → success / error
 * - Supports cancel while uploading
 *
 * Server expectation: POST /api/upload (multipart/form-data)
 */
export default function UploadWithProgress() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0); // 0 - 100
  const [status, setStatus] = useState("idle"); // idle | uploading | success | error | canceled
  const [message, setMessage] = useState("");
  const xhrRef = useRef(null);

  const onFileChange = (e) => {
    const f = e.target.files?.[0];
    setFile(f || null);
    setProgress(0);
    setStatus("idle");
    setMessage("");
  };

  const upload = async () => {
    if (!file || status === "uploading") return;

    const form = new FormData();
    form.append("file", file);

    setStatus("uploading");
    setProgress(0);
    setMessage("");

    try {
      const res = await uploadWithProgress("https://api.benben.pics/file/upload/", form, (p) => {
        setProgress(p);
      });
      setStatus("success");
      setMessage(res?.message || "Uploaded successfully");
    } catch (err) {
      if (err?.name === "AbortError") {
        setStatus("canceled");
        setMessage("Upload canceled");
      } else {
        setStatus("error");
        setMessage(err?.message || "Upload failed");
      }
    } finally {
      xhrRef.current = null;
    }
  };

  const cancel = () => {
    try {
      xhrRef.current?.abort();
    } catch (_) {}
  };

  /**
   * XHR wrapper that exposes upload progress.
   * Returns a Promise that resolves with parsed JSON (if any).
   */
  function uploadWithProgress(url, formData, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;

      xhr.open("POST", url);

      // Add JWT token here
    //   const token = localStorage.getItem("user"); // or however you store the token
    //   console.log(token);

        xhr.setRequestHeader("Authorization", `Bearer ${JSON.parse(localStorage.getItem("user")).token}`);


      // Progress: total is computable only if server doesn't use chunked-transfer
      xhr.upload.onprogress = (evt) => {
        if (!evt.lengthComputable) return; // avoid NaN when total is unknown
        const percent = Math.round((evt.loaded / evt.total) * 100);
        onProgress?.(percent);
      };

      xhr.onload = () => {
        const contentType = xhr.getResponseHeader("Content-Type") || "";
        const isJson = contentType.includes("application/json");
        const body = isJson ? safeJsonParse(xhr.responseText) : xhr.responseText;

        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress?.(100);
          resolve(body);
        } else {
          const msg = (body && body.message) || `Server error (${xhr.status})`;
          reject(new Error(msg));
        }
      };

      xhr.onerror = () => {
        reject(new Error("Network error during upload"));
      };

      xhr.onabort = () => {
        const err = new Error("aborted");
        err.name = "AbortError";
        reject(err);
      };

      xhr.send(formData);
    });
  }

  function safeJsonParse(s) {
    try {
      return JSON.parse(s);
    } catch (_) {
      return null;
    }
  }

  const canUpload = !!file && status !== "uploading";
  const isUploading = status === "uploading";

  return (
        <div className="min-h-[60vh] w-full max-w-xl mx-auto p-6">
        <h1 className="text-2xl font-semibold mb-4">Upload a file</h1>

        <label className="block">
            <span className="text-sm text-gray-600">Choose file</span>
            <input
            type="file"
            onChange={onFileChange}
            className="mt-1 block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-2xl file:border-0 file:text-sm file:font-semibold file:bg-gray-900 file:text-white hover:file:bg-gray-800"
            />
      </label>

      {file && (
        <div className="mt-4 text-sm text-gray-700">
          <div className="font-medium">{file.name}</div>
          <div className="text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-3">
        <button
          onClick={upload}
          disabled={!canUpload}
          className="px-4 py-2 rounded-2xl bg-black text-white disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isUploading ? "Uploading…" : "Upload"}
        </button>
        {isUploading && (
          <button
            onClick={cancel}
            className="px-3 py-2 rounded-2xl border border-gray-300"
          >
            Cancel
          </button>
        )}
        <div className="ml-auto text-sm capitalize">Status: {status}</div>
      </div>

      {/* Progress bar */}
      <div className="mt-4">
        <div className="h-3 w-full bg-gray-200 rounded-2xl overflow-hidden">
          <div
            className="h-full bg-black transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="mt-2 text-sm text-gray-700">{progress}%</div>
      </div>

      {/* Server message */}
      {message && (
        <div className="mt-3 text-sm text-gray-700">{message}</div>
      )}

      {/* Tips */}
      <ul className="mt-6 list-disc list-inside text-sm text-gray-600 space-y-1">
        <li>Update the upload URL (currently <code>/api/upload</code>) to your backend route.</li>
        <li>If you use Axios, pass <code>onUploadProgress</code> in the config to receive progress events.</li>
        <li>Some proxies strip <code>Content-Length</code>, which can prevent precise percentages.</li>
      </ul>
    </div>
  );
}