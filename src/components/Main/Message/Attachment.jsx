import { Download } from "react-feather";
import "./Attachment.css";

function isImage(type) {
  return type?.startsWith("image/");
}

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function Attachment({ url, name, type, size }) {
  if (isImage(type)) {
    return (
      <div className="attachment attachment-image">
        <a href={url} target="_blank" rel="noopener noreferrer">
          <img src={url} alt={name} loading="lazy" />
        </a>
      </div>
    );
  }

  return (
    <div className="attachment attachment-file">
      <a href={url} target="_blank" rel="noopener noreferrer" download>
        <Download size={14} />
        <span className="attachment-name">{name}</span>
        {size && <span className="attachment-size">{formatSize(size)}</span>}
      </a>
    </div>
  );
}
