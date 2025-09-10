import React, { useRef, useState, useEffect } from 'react';
import UploadStatusBox from "../UploadStatusBox/UploadStatusBox"
import authContext from '../../context/authContext';
import { useContext } from 'react';
export default function UploadModal({ onClose , refreshItems }) {
 

  const AuthContext = useContext(authContext)

  const fileInputRef = useRef(null);
  const xhrRef = useRef(null);

  // idle → ready → uploading → success/error/canceled
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fileInputRef.current?.click();
  }, []);

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (!f) return; 
    setFile(f);
    setProgress(0);
    setMessage('');
    setStatus('ready');
  };

  const upload = async () => {
    if (!file || status === 'uploading') return;

    const form = new FormData();
    form.append('file', file);

    setStatus('uploading');
    setProgress(0);
    setMessage('');

    try {
      const res = await uploadWithProgress(
        'https://api.benben.pics/file/upload/',
        form,
        (p) => setProgress(p)
      );
      setStatus('success');
      setMessage(res?.message || 'Uploaded successfully');

      refreshItems()


try {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user?.token) {
    const res = await fetch("https://api.benben.pics/accounts/me/", {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    if (res.ok) {
      const data = await res.json();

      localStorage.setItem("user", JSON.stringify({ token: user.token, ...data }));

      if (typeof AuthContext?.login === "function") {
        await AuthContext.login(user.token);
      }
    }
  }
} catch (e) {
  console.error("refresh after upload failed:", e);
}


    } 
    catch (err) {
      if (err?.name === 'AbortError') {
        setStatus('canceled');
        setMessage('Upload canceled');
      } else {
        setStatus('error');
        setMessage(err?.message || 'Upload failed');
      }
    } finally {
      xhrRef.current = null;
    }
  };

  const cancel = () => {
    try { xhrRef.current?.abort(); } catch {}
  };

  function uploadWithProgress(url, formData, onProgress) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhrRef.current = xhr;
      xhr.open('POST', url);

      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user?.token) {
          xhr.setRequestHeader('Authorization', `Bearer ${user.token}`);
        }
      } catch {}

      xhr.upload.onprogress = (evt) => {
        if (!evt.lengthComputable) return;
        const percent = Math.round((evt.loaded / evt.total) * 100);
        onProgress?.(percent);
      };

      xhr.onload = () => {
        const ct = xhr.getResponseHeader('Content-Type') || '';
        const isJson = ct.includes('application/json');
        const body = isJson ? safeJsonParse(xhr.responseText) : xhr.responseText;

        if (xhr.status >= 200 && xhr.status < 300) {
          onProgress?.(100);
          resolve(body);
        } else {
          const msg = (body && body.message) || `Server error (${xhr.status})`;
          reject(new Error(msg));
        }
      };

      xhr.onerror = () => reject(new Error('Network error during upload'));
      xhr.onabort  = () => { const e = new Error('aborted'); e.name = 'AbortError'; reject(e); };

      xhr.send(formData);
    });
  }

  function safeJsonParse(s) {
    try { return JSON.parse(s); } catch { return null; }
  }

  const closeOnBackdrop = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div className="fixed inset-0 z-50" onClick={closeOnBackdrop}>
      <div className="absolute inset-0 bg-black/40" />

      <div className="absolute left-1/2 top-[10rem] -translate-x-1/2 bg-white p-8 rounded-2xl shadow-xl w-[520px]">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-[#0F0F0F] text-2xl font-MorabbaBold">Upload</h1>
          <button className="text-gray-500 hover:text-black" onClick={onClose}>✕</button>
        </div>

        <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />

        {status === 'idle' && !file && (
          <div className="mt-6 p-5 rounded-2xl border bg-gray-50">
            <div className="text-sm text-gray-700">
              No file selected.
              <button
                onClick={() => fileInputRef.current?.click()}
                className="ml-2 underline"
              >
                Browse file
              </button>
            </div>
          </div>
        )}

        {status === 'ready' && file && (
          <div className="mt-4">
            <div className="p-5 rounded-2xl border bg-gray-50">
              <div className="text-sm font-MorabbaBold">{file.name}</div>
              <div className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</div>
            </div>

            <div className="mt-5 flex items-center gap-3">
              <button onClick={upload} className="px-4 py-2 rounded-2xl bg-black text-white">
                Upload
              </button>
              <button
                onClick={() => {
                  setFile(null);
                  setStatus('idle');
                  setProgress(0);
                  setMessage('');
                  fileInputRef.current?.click(); 
                }}
                className="px-4 py-2 rounded-2xl border"
              >
                Browse file (select another file)
              </button>
            </div>
          </div>
        )}

        {status === 'uploading' && (
          <div className="mt-4">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-gray-300 border-t-black rounded-full animate-spin" />
              <span className="text-sm">Uploading…</span>
              <button onClick={cancel} className="ml-auto px-3 py-2 rounded-2xl border">
                Cancel
              </button>
            </div>

            <div className="mt-3 h-2 bg-gray-200 rounded-2xl overflow-hidden">
              <div className="h-full bg-black transition-all" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-1 text-xs text-gray-600">{progress}%</div>
          </div>
        )}

        {(status === 'success' || status === 'error' || status === 'canceled') && (
          <div>
            <UploadStatusBox status={status} progress={progress} message={message} />
            <div className="mt-4 flex gap-3">
              <button
                onClick={() => {
                  setFile(null);
                  setStatus('idle');
                  setProgress(0);
                  setMessage('');
                  fileInputRef.current?.click(); 
                }}
                className="px-4 py-2 rounded-2xl border"
              >
                Browse file (select another file)
              </button>
              <button onClick={onClose} className="px-4 py-2 rounded-2xl bg-black text-white">
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
