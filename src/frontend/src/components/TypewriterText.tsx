import { useEffect, useState } from "react";

interface TypewriterTextProps {
  content: string;
  speed?: number;
}

export function TypewriterText({ content, speed = 30 }: TypewriterTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(() => {
        setDisplayedText((prev) => prev + content[currentIndex]);
        setCurrentIndex((prev) => prev + 1);
      }, speed);
      return () => clearTimeout(timer);
    }
  }, [content, currentIndex, speed]);

  return (
    <span className="whitespace-pre-wrap">
      {displayedText}
      {currentIndex < content.length && (
        <span className="animate-pulse">▊</span>
      )}
    </span>
  );
}
