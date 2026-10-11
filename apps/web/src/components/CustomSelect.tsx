"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";

interface Role {
  id: string;
  name: string;
}

interface CustomSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Role[];
  placeholder?: string;
  className?: string;
}

export function CustomSelect({ value, onChange, options, placeholder = "Select...", className = "" }: CustomSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((opt) => opt.id === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white border-2 border-gray-200 rounded-xl px-4 py-3 text-left text-gray-900 hover:border-blue-300 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all flex items-center justify-between shadow-sm"
      >
        <span className={selectedOption ? "text-gray-900 font-medium" : "text-gray-400"}>
          {selectedOption ? `# ${selectedOption.name}` : placeholder}
        </span>
        <ChevronDown size={18} className={`text-gray-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border-2 border-gray-200 rounded-xl shadow-xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-100">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {options.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  onChange(option.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-4 py-3 hover:bg-blue-50 transition-colors ${
                  value === option.id ? "bg-blue-100 text-blue-700 font-semibold" : "text-gray-700"
                }`}
              >
                # {option.name}
              </button>
            ))}
            {options.length === 0 && (
              <div className="px-4 py-3 text-gray-500 text-center">No channels available</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
