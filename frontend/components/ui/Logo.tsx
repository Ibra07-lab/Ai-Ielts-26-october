import React from 'react';

export function Logo({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 100 100" 
      fill="currentColor" 
      className={className || "w-8 h-8"}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* 
        Recreating the ascending bar chart + 'N' logo shown in the user's image.
        It consists of 4 pillars with an angled top and a stylized 'N' diagonal.
      */}
      {/* Rightmost pillar */}
      <polygon points="76,22 96,14 96,82 76,90" />
      
      {/* 3rd pillar */}
      <polygon points="53,31 73,23 73,91 53,99" />
      
      {/* 2nd pillar (contains the diagonal of the N going down-right) */}
      <polygon points="30,40 50,32 50,85 30,65" />
      
      {/* 1st pillar (Leftmost part of the N) */}
      <polygon points="9,48 26,41 26,60 9,78" />
      <polygon points="9,78 26,60 26,90 9,98" /> 
      {/* Actually a single solid shape for the leftmost part */}
      <polygon points="9,48 26,41 26,60 21,65 21,93 9,98" />
      
      {/* Combine the 1st pillar into a clean shape based on the image: 
          It has a left vertical edge, top angle, down diagonal, inner vertical edge. */}
      {/* Re-writing the 1st pillar to perfectly match the N notch: */}
      <path d="M7 50 L26 42 L26 62 L15 73 L15 94 L7 97 Z" />
    </svg>
  );
}
