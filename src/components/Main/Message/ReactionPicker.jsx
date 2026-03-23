import "./ReactionPicker.css";

const EMOJIS = ["\u{1F44D}", "\u{2764}\u{FE0F}", "\u{1F602}", "\u{1F525}", "\u{1F440}", "\u{1F680}", "\u{1F389}", "\u{1F64F}", "\u{1F4AF}", "\u{1F914}"];

export default function ReactionPicker({ onSelect, onClose }) {
  return (
    <>
      <div className="reaction-picker-overlay" onClick={onClose} />
      <div className="reaction-picker">
        {EMOJIS.map((emoji) => (
          <button
            key={emoji}
            onClick={() => {
              onSelect(emoji);
              onClose();
            }}
          >
            {emoji}
          </button>
        ))}
      </div>
    </>
  );
}
