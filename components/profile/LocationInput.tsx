"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

async function fetchCitySuggestions(input: string): Promise<{ id: string; label: string }[]> {
  const key = process.env.NEXT_PUBLIC_GOOGLE_PLACES_KEY;
  if (!key || !input.trim()) return [];
  const res = await fetch("https://places.googleapis.com/v1/places:autocomplete", {
    method: "POST",
    headers: { "Content-Type": "application/json", "X-Goog-Api-Key": key },
    body: JSON.stringify({ input, includedPrimaryTypes: ["locality", "administrative_area_level_3"] }),
  });
  if (!res.ok) return [];
  const data = await res.json();
  return (data.suggestions ?? []).map((s: { placePrediction: { placeId: string; text: { text: string } } }) => ({
    id: s.placePrediction.placeId,
    label: s.placePrediction.text.text,
  }));
}

type LocationInputProps = {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  inputClassName?: string;
  suggestionClassName?: string;
  suggestionHighlightClassName?: string;
};

const defaultInputClassName =
  "w-full rounded-sm border border-neutral-200 bg-white px-3 py-2 font-mono text-sm text-neutral-900 placeholder:text-neutral-400 focus:border-[#00a6f3] focus:outline-none";

export function LocationInput({
  value,
  onChange,
  id = "location",
  placeholder = "Type your city…",
  inputClassName = defaultInputClassName,
  suggestionClassName = "text-neutral-600 hover:bg-[#00a6f3] hover:text-white",
  suggestionHighlightClassName = "bg-[#00a6f3] text-white",
}: LocationInputProps) {
  const [suggestions, setSuggestions] = useState<{ id: string; label: string }[]>([]);
  const [open, setOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const fetchSuggestions = useCallback((input: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const results = await fetchCitySuggestions(input);
      setSuggestions(results);
      setHighlightedIndex(-1);
      setOpen(results.length > 0);
    }, 250);
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    onChange(e.target.value);
    fetchSuggestions(e.target.value);
  }

  function handleSelect(label: string) {
    onChange(label);
    setSuggestions([]);
    setOpen(false);
    setHighlightedIndex(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (!open || suggestions.length === 0) return;
      const next = Math.min(highlightedIndex + 1, suggestions.length - 1);
      setHighlightedIndex(next);
      listRef.current?.children[next]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (!open || suggestions.length === 0) return;
      const next = Math.max(highlightedIndex - 1, 0);
      setHighlightedIndex(next);
      listRef.current?.children[next]?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") {
      if (open && highlightedIndex >= 0 && suggestions[highlightedIndex]) {
        e.preventDefault();
        handleSelect(suggestions[highlightedIndex].label);
      } else {
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlightedIndex(-1);
    }
  }

  return (
    <div ref={containerRef} className="relative">
      <input
        id={id}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        aria-autocomplete="list"
        aria-expanded={open}
        aria-activedescendant={highlightedIndex >= 0 ? `city-option-${highlightedIndex}` : undefined}
        className={inputClassName}
      />
      <AnimatePresence>
        {open && (
          <motion.ul
            ref={listRef}
            role="listbox"
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-20 top-full left-0 right-0 mt-1 max-h-52 overflow-y-auto border border-neutral-200 bg-white shadow-lg"
          >
            {suggestions.map(({ id: suggestionId, label }, index) => (
              <li
                key={suggestionId}
                id={`city-option-${index}`}
                role="option"
                aria-selected={index === highlightedIndex}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(label);
                }}
                onMouseEnter={() => setHighlightedIndex(index)}
                className={`cursor-pointer px-3 py-2 font-mono text-sm transition-colors ${
                  index === highlightedIndex ? suggestionHighlightClassName : suggestionClassName
                }`}
              >
                {label}
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}
