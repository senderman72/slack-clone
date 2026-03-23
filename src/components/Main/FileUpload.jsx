import { useRef, useState } from "react";
import { Paperclip, X } from "react-feather";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage, auth } from "../../firebase";
import "./FileUpload.css";

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export default function FileUpload({ onUploadComplete }) {
  const fileRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");

  function handleFileSelect(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    uploadFile(file);
    e.target.value = "";
  }

  function uploadFile(file) {
    if (file.size > MAX_SIZE) {
      setError("File must be under 10MB");
      setTimeout(() => setError(""), 3000);
      return;
    }

    setUploading(true);
    setProgress(0);
    setError("");

    const uid = auth.currentUser.uid;
    const filename = `${Date.now()}_${file.name}`;
    const storageRef = ref(storage, `uploads/${uid}/${filename}`);
    const task = uploadBytesResumable(storageRef, file);

    task.on(
      "state_changed",
      (snapshot) => {
        setProgress(Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100));
      },
      (err) => {
        setError("Upload failed");
        setUploading(false);
        setTimeout(() => setError(""), 3000);
      },
      async () => {
        const url = await getDownloadURL(task.snapshot.ref);
        onUploadComplete({
          url,
          name: file.name,
          type: file.type,
          size: file.size,
        });
        setUploading(false);
        setProgress(0);
      }
    );
  }

  function handlePaste(e) {
    const items = e.clipboardData?.items;
    if (!items) return;
    for (const item of items) {
      if (item.type.startsWith("image/")) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) uploadFile(file);
        return;
      }
    }
  }

  return (
    <div className="file-upload">
      <input
        ref={fileRef}
        type="file"
        onChange={handleFileSelect}
        style={{ display: "none" }}
        accept="image/*,.pdf,.doc,.docx,.txt,.zip"
      />
      <button
        className="attach-btn"
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        aria-label="Attach file"
      >
        <Paperclip size={18} />
      </button>
      {uploading && (
        <div className="upload-progress">
          <div className="upload-bar" style={{ width: `${progress}%` }} />
          <span>{progress}%</span>
        </div>
      )}
      {error && <span className="upload-error">{error}</span>}
    </div>
  );
}

// Export handlePaste so ChatView can use it
export { MAX_SIZE };
