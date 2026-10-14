"use client";

import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";

export interface EmojiPickerProps {
  onSelect: (emoji: string) => void;
  onClose: () => void;
  guildId?: string; // if provided, loads server custom emojis
}

interface EmojiItem {
  char: string;
  name: string;
}

interface CustomEmoji {
  id: string;
  name: string;
  animated: boolean;
}

// ─── Static emoji data ────────────────────────────────────────────────────────

const EMOJI_DATA: { category: string; icon: string; emojis: EmojiItem[] }[] = [
  {
    category: "Discord",
    icon: "🎫",
    emojis: [
      { char: "🎫", name: "ticket" },
      { char: "📩", name: "mailbox" },
      { char: "💬", name: "speech bubble" },
      { char: "⚙️", name: "gear" },
      { char: "🛡️", name: "shield" },
      { char: "ℹ️", name: "info" },
      { char: "✉️", name: "envelope" },
      { char: "🔑", name: "key" },
      { char: "🆘", name: "sos" },
      { char: "🙋", name: "raising hand" },
      { char: "🚨", name: "alert" },
      { char: "🔥", name: "fire" },
      { char: "👑", name: "crown" },
      { char: "🏆", name: "trophy" },
      { char: "⭐", name: "star" },
      { char: "✅", name: "check" },
      { char: "❌", name: "cross" },
      { char: "⚠️", name: "warning" },
      { char: "🔔", name: "bell" },
      { char: "📢", name: "megaphone" },
      { char: "🎉", name: "party" },
      { char: "🎊", name: "confetti" },
      { char: "💎", name: "gem" },
      { char: "🚀", name: "rocket" },
    ],
  },
  {
    category: "Smileys",
    icon: "😀",
    emojis: [
      { char: "😀", name: "grinning" },
      { char: "😃", name: "big eyes" },
      { char: "😄", name: "smile" },
      { char: "😁", name: "beaming" },
      { char: "😆", name: "laughing" },
      { char: "😅", name: "sweat smile" },
      { char: "😂", name: "joy" },
      { char: "🤣", name: "rofl" },
      { char: "😊", name: "blush" },
      { char: "😇", name: "halo" },
      { char: "😉", name: "wink" },
      { char: "😍", name: "heart eyes" },
      { char: "🥰", name: "hearts" },
      { char: "😘", name: "kiss" },
      { char: "😎", name: "sunglasses" },
      { char: "🥳", name: "party" },
      { char: "🤔", name: "thinking" },
      { char: "😏", name: "smirk" },
      { char: "😒", name: "unamused" },
      { char: "😴", name: "sleeping" },
      { char: "🥵", name: "hot" },
      { char: "🥶", name: "cold" },
      { char: "🤯", name: "exploding" },
      { char: "😤", name: "triumph" },
      { char: "😡", name: "angry" },
      { char: "🤬", name: "cursing" },
      { char: "😭", name: "crying" },
      { char: "🥺", name: "pleading" },
      { char: "😱", name: "screaming" },
      { char: "😈", name: "devil" },
    ],
  },
  {
    category: "Gestures",
    icon: "👍",
    emojis: [
      { char: "👋", name: "wave" },
      { char: "✋", name: "raised hand" },
      { char: "👌", name: "ok" },
      { char: "✌️", name: "peace" },
      { char: "🤞", name: "crossed fingers" },
      { char: "🤟", name: "love you" },
      { char: "👈", name: "left" },
      { char: "👉", name: "right" },
      { char: "👆", name: "up" },
      { char: "👇", name: "down" },
      { char: "☝️", name: "index up" },
      { char: "👍", name: "thumbs up" },
      { char: "👎", name: "thumbs down" },
      { char: "✊", name: "fist" },
      { char: "👊", name: "punch" },
      { char: "👏", name: "clap" },
      { char: "🙌", name: "raising hands" },
      { char: "🤝", name: "handshake" },
      { char: "🙏", name: "pray" },
      { char: "💪", name: "flexed biceps" },
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
      { char: "💔", name: "broken heart" },
      { char: "✨", name: "sparkles" },
      { char: "⭐", name: "star" },
      { char: "🌟", name: "glowing star" },
      { char: "💫", name: "dizzy" },
      { char: "🔥", name: "fire" },
      { char: "💥", name: "explosion" },
      { char: "⚡", name: "lightning" },
      { char: "🌈", name: "rainbow" },
      { char: "❓", name: "question" },
      { char: "❗", name: "exclamation" },
      { char: "🔴", name: "red circle" },
      { char: "🟠", name: "orange circle" },
      { char: "🟡", name: "yellow circle" },
      { char: "🟢", name: "green circle" },
      { char: "🔵", name: "blue circle" },
      { char: "🟣", name: "purple circle" },
      { char: "⚫", name: "black circle" },
      { char: "⚪", name: "white circle" },
      { char: "🔶", name: "orange diamond" },
      { char: "🔷", name: "blue diamond" },
      { char: "▶️", name: "play" },
    ],
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export function EmojiPicker({ onSelect, onClose, guildId }: EmojiPickerProps) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Discord");
  const [customEmojis, setCustomEmojis] = useState<CustomEmoji[]>([]);
  const [loadingCustom, setLoadingCustom] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Load custom server emojis
  useEffect(() => {
    if (!guildId) return;
    setLoadingCustom(true);
    fetch(`/api/guild/emojis?guildId=${guildId}`)
      .then(r => r.json())
      .then(data => {
        setCustomEmojis(data.emojis || []);
        if (data.emojis?.length > 0) setActiveCategory("Server");
      })
      .catch(() => {})
      .finally(() => setLoadingCustom(false));
  }, [guildId]);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  // Build tabs — server emojis first if available
  const tabs = [
    ...(customEmojis.length > 0
      ? [{ id: "Server", icon: "🖼️", isCustom: true }]
      : []),
    ...EMOJI_DATA.map(c => ({ id: c.category, icon: c.icon, isCustom: false })),
  ];

  // Filter standard emojis on search
  const filteredStandard = EMOJI_DATA.flatMap(cat =>
    cat.emojis.filter(e =>
      e.name.toLowerCase().includes(search.toLowerCase()) || e.char === search
    ).map(e => ({ ...e, category: cat.category }))
  );

  // Filter custom emojis on search
  const filteredCustom = customEmojis.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (emoji: string) => {
    onSelect(emoji);
    onClose();
  };

  const handleSelectCustom = (emoji: CustomEmoji) => {
    // Discord custom emoji format: <:name:id> or <a:name:id> for animated
    const formatted = emoji.animated
      ? `<a:${emoji.name}:${emoji.id}>`
      : `<:${emoji.name}:${emoji.id}>`;
    handleSelect(formatted);
  };

  return (
    <div
      ref={pickerRef}
      className="absolute z-50"
      style={{
        bottom: "calc(100% + 8px)",
        left: 0,
        width: 300,
        background: "#121315",
        border: "1px solid rgba(255,255,255,0.1)",
        borderRadius: 14,
        boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
        overflow: "hidden",
      }}
    >
      {/* Search */}
      <div className="p-3 pb-0">
        <div className="relative">
          <Search className="absolute left-3 top-2 w-3.5 h-3.5" style={{ color: "#A8A9A2" }} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search emoji..."
            autoFocus
            style={{
              width: "100%",
              background: "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              padding: "7px 10px 7px 30px",
              fontSize: 12,
              color: "#F5F4F5",
              outline: "none",
            }}
          />
        </div>
      </div>

      {/* Category tabs — only show when not searching */}
      {!search && (
        <div
          className="flex gap-0.5 px-3 pt-3 pb-2 overflow-x-auto"
          style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveCategory(tab.id)}
              title={tab.id}
              className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-base transition-all"
              style={activeCategory === tab.id
                ? { background: "rgba(31,167,187,0.15)", outline: "1px solid rgba(31,167,187,0.3)" }
                : { opacity: 0.5 }
              }
            >
              {tab.icon}
            </button>
          ))}
        </div>
      )}

      {/* Emoji grid */}
      <div
        className="overflow-y-auto p-2"
        style={{ height: 180 }}
      >
        {/* Searching */}
        {search && (
          <>
            {/* Custom emojis matching search */}
            {filteredCustom.length > 0 && (
              <div className="mb-3">
                <p className="text-[9px] font-semibold uppercase tracking-widest px-1 mb-1.5" style={{ color: "rgba(255,255,255,0.25)" }}>
                  Server Emojis
                </p>
                <div className="grid grid-cols-7 gap-0.5">
                  {filteredCustom.map(e => (
                    <button
                      key={e.id}
                      onClick={() => handleSelectCustom(e)}
                      title={`:${e.name}:`}
                      className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                    >
                      <img
                        src={`https://cdn.discordapp.com/emojis/${e.id}.${e.animated ? "gif" : "webp"}?size=32`}
                        alt={e.name}
                        className="w-6 h-6 object-contain"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}
            {/* Standard emojis matching search */}
            {filteredStandard.length > 0 && (
              <div className="grid grid-cols-7 gap-0.5">
                {filteredStandard.map((e, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(e.char)}
                    title={e.name}
                    className="w-8 h-8 flex items-center justify-center rounded-lg text-xl transition-colors hover:bg-white/10"
                  >
                    {e.char}
                  </button>
                ))}
              </div>
            )}
            {filteredCustom.length === 0 && filteredStandard.length === 0 && (
              <p className="text-xs text-center py-8" style={{ color: "rgba(255,255,255,0.25)" }}>No emojis found</p>
            )}
          </>
        )}

        {/* Server custom emojis tab */}
        {!search && activeCategory === "Server" && (
          <>
            {loadingCustom ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>Loading...</p>
              </div>
            ) : customEmojis.length === 0 ? (
              <p className="text-xs text-center py-8" style={{ color: "rgba(255,255,255,0.25)" }}>No custom emojis on this server</p>
            ) : (
              <div className="grid grid-cols-7 gap-0.5">
                {customEmojis.map(e => (
                  <button
                    key={e.id}
                    onClick={() => handleSelectCustom(e)}
                    title={`:${e.name}:`}
                    className="w-8 h-8 flex items-center justify-center rounded-lg transition-colors hover:bg-white/10"
                  >
                    <img
                      src={`https://cdn.discordapp.com/emojis/${e.id}.${e.animated ? "gif" : "webp"}?size=32`}
                      alt={e.name}
                      className="w-6 h-6 object-contain"
                    />
                  </button>
                ))}
              </div>
            )}
          </>
        )}

        {/* Standard emoji tab */}
        {!search && activeCategory !== "Server" && (
          <div className="grid grid-cols-7 gap-0.5">
            {EMOJI_DATA.find(c => c.category === activeCategory)?.emojis.map((e, i) => (
              <button
                key={i}
                onClick={() => handleSelect(e.char)}
                title={e.name}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-xl transition-colors hover:bg-white/10"
              >
                {e.char}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Footer hint for custom emojis */}
      {activeCategory === "Server" && customEmojis.length > 0 && !search && (
        <div
          className="px-3 py-1.5 text-center text-[10px]"
          style={{ borderTop: "1px solid rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.2)" }}
        >
          {customEmojis.length} custom emoji{customEmojis.length !== 1 ? "s" : ""} from your server
        </div>
      )}
    </div>
  );
}
