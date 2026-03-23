import "./PresenceIndicator.css";

export default function PresenceIndicator({ online, size = 10 }) {
  return (
    <span
      className={`presence-dot ${online ? "presence-online" : "presence-offline"}`}
      style={{ width: size, height: size }}
    />
  );
}
