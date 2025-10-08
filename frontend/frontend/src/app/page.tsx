"use client";

import { useEffect, useState } from "react";
import Header from "@/components/Header";

export default function LandingPage() {
  const words = ["Secure.", "Private."];
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    let typingSpeed = isDeleting ? 60 : 120;

    const handleTyping = () => {
      if (!isDeleting) {
        setDisplayedText(currentWord.slice(0, displayedText.length + 1));
        if (displayedText === currentWord) {
          setTimeout(() => setIsDeleting(true), 1200); 
        }
      } else {
        setDisplayedText(currentWord.slice(0, displayedText.length - 1));
        if (displayedText === "") {
          setIsDeleting(false);
          setCurrentWordIndex((prev) => (prev + 1) % words.length);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [displayedText, isDeleting, currentWordIndex]);

  return (
    <main className="min-h-screen bg-black text-white">
      <Header />
      <div className="flex flex-col items-center  bg-black justify-center text-center mt-64">
        <div className="bg-black">
          <span className="text-4xl font-semibold text-green-400">
            Generate, store, and manage
          </span>
          <p className="text-4xl font-semibold text-gray-300 mb-8">
            all in one place.
          </p>
        </div>

        <p className="text-gray-400 mb-2 max-w-md">
          Your passwords remain with you —
        </p>

        <p className="text-green-400 text-3xl font-semibold mt-2 h-10">
          {displayedText}
          <span className="border-r-2 border-green-400 animate-pulse ml-1"></span>
        </p>
      </div>
    </main>
  );
}
