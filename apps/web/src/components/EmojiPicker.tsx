"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
}

interface EmojiItem {
  char: string;
  name: string;
}

const EMOJI_DATA: { category: string; icon: string; emojis: EmojiItem[] }[] = [
  {
    category: "Frequently Used",
    icon: "⭐",
    emojis: [
      { char: "🎫", name: "ticket" },
      { char: "📩", name: "mailbox receive" },
      { char: "💬", name: "speech bubble" },
      { char: "⚙️", name: "gear" },
      { char: "🛡️", name: "shield" },
      { char: "ℹ️", name: "info" },
      { char: "✉️", name: "envelope" },
      { char: "🔑", name: "key" },
      { char: "🆘", name: "sos" },
      { char: "🙋", name: "raising hand" },
      { char: "🚨", name: "police car light" },
      { char: "🔥", name: "fire" },
    ],
  },
  {
    category: "Smileys",
    icon: "😃",
    emojis: [
      { char: "😀", name: "grinning face" },
      { char: "😃", name: "grinning face with big eyes" },
      { char: "😄", name: "grinning face with smiling eyes" },
      { char: "😁", name: "beaming face with smiling eyes" },
      { char: "😆", name: "grinning squinting face" },
      { char: "😅", name: "grinning face with sweat" },
      { char: "😂", name: "face with tears of joy" },
      { char: "🤣", name: "rolling on the floor laughing" },
      { char: "😊", name: "smiling face with smiling eyes" },
      { char: "😇", name: "smiling face with halo" },
      { char: "🙂", name: "slightly smiling face" },
      { char: "🙃", name: "upside-down face" },
      { char: "😉", name: "winking face" },
      { char: "😌", name: "relieved face" },
      { char: "😍", name: "smiling face with heart-eyes" },
      { char: "🥰", name: "smiling face with hearts" },
      { char: "😘", name: "face blowing a kiss" },
      { char: "😋", name: "face savoring food" },
      { char: "😛", name: "face with tongue" },
      { char: "😜", name: "winking face with tongue" },
      { char: "🤪", name: "zany face" },
      { char: "😝", name: "squinting face with tongue" },
      { char: "🤑", name: "money-mouth face" },
      { char: "🤗", name: "smiling face with open hands" },
      { char: "🤔", name: "thinking face" },
      { char: "🤭", name: "face with hand over mouth" },
      { char: "🤫", name: "shushing face" },
      { char: "🧐", name: "face with monocle" },
      { char: "🤓", name: "nerd face" },
      { char: "😎", name: "smiling face with sunglasses" },
      { char: "🥳", name: "partying face" },
      { char: "😏", name: "smirking face" },
      { char: "😒", name: "unamused face" },
      { char: "🙄", name: "face with rolling eyes" },
      { char: "😬", name: "grimacing face" },
      { char: "🤥", name: "lying face" },
      { char: "😴", name: "sleeping face" },
      { char: "🤤", name: "drooling face" },
      { char: "😪", name: "sleepy face" },
      { char: "🤢", name: "nauseated face" },
      { char: "🤮", name: "face vomiting" },
      { char: "🥵", name: "hot face" },
      { char: "🥶", name: "cold face" },
      { char: "🥴", name: "woozy face" },
      { char: "😵", name: "knocked-out face" },
      { char: "🤯", name: "exploding head" },
      { char: "🤠", name: "cowboy hat face" },
      { char: "🥳", name: "partying face" },
      { char: "🥸", name: "disguised face" },
      { char: "😎", name: "cool" },
    ],
  },
  {
    category: "Gestures",
    icon: "👍",
    emojis: [
      { char: "👋", name: "waving hand" },
      { char: "🤚", name: "raised back of hand" },
      { char: "🖐️", name: "hand with fingers splayed" },
      { char: "✋", name: "raised hand" },
      { char: "🖖", name: "vulcan salute" },
      { char: "👌", name: "ok hand" },
      { char: "🤌", name: "pinched fingers" },
      { char: "🤏", name: "pinching hand" },
      { char: "✌️", name: "victory hand" },
      { char: "🤞", name: "crossed fingers" },
      { char: "🤟", name: "love-you gesture" },
      { char: "🤘", name: "sign of the horns" },
      { char: "🤙", name: "call me hand" },
      { char: "👈", name: "backhand index pointing left" },
      { char: "👉", name: "backhand index pointing right" },
      { char: "👆", name: "backhand index pointing up" },
      { char: "🖕", name: "middle finger" },
      { char: "👇", name: "backhand index pointing down" },
      { char: "☝️", name: "index pointing up" },
      { char: "👍", name: "thumbs up" },
      { char: "👎", name: "thumbs down" },
      { char: "✊", name: "raised fist" },
      { char: "👊", name: "oncoming fist" },
      { char: "🤛", name: "left-facing fist" },
      { char: "🤜", name: "right-facing fist" },
      { char: "👏", name: "clapping hands" },
      { char: "🙌", name: "raising hands" },
      { char: "👐", name: "open hands" },
      { char: "🤲", name: "palms up together" },
      { char: "🤝", name: "handshake" },
      { char: "🙏", name: "folded hands" },
    ],
  },
  {
    category: "Objects",
    icon: "🎮",
    emojis: [
      { char: "🎫", name: "ticket" },
      { char: "👑", name: "crown" },
      { char: "🏆", name: "trophy" },
      { char: "🏅", name: "sports medal" },
      { char: "🥇", name: "1st place medal" },
      { char: "🎮", name: "video game" },
      { char: "🕹️", name: "joystick" },
      { char: "🎰", name: "slot machine" },
      { char: "🎲", name: "game die" },
      { char: "🧩", name: "puzzle piece" },
      { char: "🎸", name: "guitar" },
      { char: "🎧", name: "headphone" },
      { char: "🎤", name: "microphone" },
      { char: "🎨", name: "artist palette" },
      { char: "🎬", name: "clapper board" },
      { char: "🍿", name: "popcorn" },
      { char: "🛡️", name: "shield" },
      { char: "🔑", name: "key" },
      { char: "🔒", name: "locked" },
      { char: "🔓", name: "unlocked" },
      { char: "⚙️", name: "gear" },
      { char: "🛠️", name: "hammer and wrench" },
      { char: "📦", name: "package" },
      { char: "✉️", name: "envelope" },
      { char: "📩", name: "envelope with arrow" },
      { char: "💬", name: "speech balloon" },
      { char: "📣", name: "megaphone" },
      { char: "📢", name: "loudspeaker" },
      { char: "🔔", name: "bell" },
      { char: "📌", name: "pushpin" },
    ],
  },
  {
    category: "Symbols",
    icon: "❤️",
    emojis: [
      { char: "❤️", name: "red heart" },
      { char: "🧡", name: "orange heart" },
      { char: "💛", name: "yellow heart" },
      { char: "💚", name: "green heart" },
      { char: "💙", name: "blue heart" },
      { char: "💜", name: "purple heart" },
      { char: "🖤", name: "black heart" },
      { char: "🤍", name: "white heart" },
      { char: "🤎", name: "brown heart" },
      { char: "💔", name: "broken heart" },
      { char: "✨", name: "sparkles" },
      { char: "⭐", name: "star" },
      { char: "🌟", name: "glowing star" },
      { char: "🔥", name: "fire" },
      { char: "💥", name: "collision" },
      { char: "⚡", name: "high voltage" },
      { char: "🌈", name: "rainbow" },
      { char: "⚠️", name: "warning" },
      { char: "⛔", name: "no entry" },
      { char: "🚫", name: "prohibited" },
      { char: "❌", name: "cross mark" },
      { char: "✅", name: "white heavy check mark" },
      { char: "☑️", name: "ballot box with check" },
      { char: "ℹ️", name: "information" },
      { char: "❓", name: "question mark" },
      { char: "❔", name: "white question mark" },
      { char: "❗", name: "exclamation mark" },
      { char: "➕", name: "plus" },
      { char: "➖", name: "minus" },
      { char: "🛑", name: "stop sign" },
    ],
  },
];

export function EmojiPicker({ onSelect, onClose }: EmojiPickerProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Frequently Used");
  const pickerRef = useRef<HTMLDivElement>(null);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Filter emojis based on search query
  const filteredData = EMOJI_DATA.map((cat) => {
    const matched = cat.emojis.filter(
      (e) =>
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.char === search
    );
    return { ...cat, emojis: matched };
  }).filter((cat) => cat.emojis.length > 0);

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-[calc(100%+8px)] left-0 w-72 bg-[#0c0c0e]/95 border-3 border-black rounded-2xl p-3 shadow-2xl  z-50 animate-fade-up"
    >
      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-2.5 w-4 h-4 text-zinc-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emoji..."
          autoFocus
          className="w-full bg-[#16161a] border-3 border-black rounded-xl pl-9 pr-4 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500/50 transition-colors"
        />
      </div>

      {/* Categories Tabs (only shown when not searching) */}
      {!search && (
        <div className="flex justify-between border-b border-white/5 pb-2 mb-2">
          {EMOJI_DATA.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setActiveCategory(cat.category)}
              title={cat.category}
              className={`p-1.5 rounded-lg text-lg transition-all hover:bg-white/5 ${
                activeCategory === cat.category ? "bg-white/10 scale-110" : "opacity-60"
              }`}
            >
              {cat.icon}
            </button>
          ))}
        </div>
      )}

      {/* Emojis Grid Container */}
      <div className="h-44 overflow-y-auto custom-scrollbar space-y-3">
        {search ? (
          filteredData.map((cat) => (
            <div key={cat.category}>
              <div className="text-[10px] text-zinc-500 font-black tracking-wider uppercase mb-1.5">
                {cat.category}
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-1">
                {cat.emojis.map((emoji) => (
                  <button
                    key={emoji.char}
                    onClick={() => {
                      onSelect(emoji.char);
                      onClose();
                    }}
                    title={emoji.name}
                    className="p-1.5 text-xl rounded-lg hover:bg-white/10 transition-colors duration-150 flex items-center justify-center"
                  >
                    {emoji.char}
                  </button>
                ))}
              </div>
            </div>
          ))
        ) : (
          <div>
            <div className="text-[10px] text-zinc-500 font-black tracking-wider uppercase mb-1.5">
              {activeCategory}
            </div>
            <div className="grid grid-cols-6 gap-1">
              {EMOJI_DATA.find((c) => c.category === activeCategory)?.emojis.map((emoji) => (
                <button
                  key={emoji.char}
                  onClick={() => {
                    onSelect(emoji.char);
                    onClose();
                  }}
                  title={emoji.name}
                  className="p-1.5 text-xl rounded-lg hover:bg-white/10 transition-colors duration-150 flex items-center justify-center animate-fade-in"
                >
                  {emoji.char}
                </button>
              ))}
            </div>
          </div>
        )}

        {filteredData.length === 0 && (
          <div className="text-xs text-zinc-500 text-center py-8">
            No emojis found
          </div>
        )}
      </div>
    </div>
  );
}
