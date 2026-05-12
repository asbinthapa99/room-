"use client";

import React from "react";

const ROOM_IMAGES = [
  "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=600&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=600&q=80",
  "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=600&q=80",
  "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80",
  "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=600&q=80",
  "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=600&q=80",
  "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=600&q=80",
];

const duplicated = [...ROOM_IMAGES, ...ROOM_IMAGES];

interface InfiniteScrollGalleryProps {
  speed?: number;
  className?: string;
}

export function InfiniteScrollGallery({ speed = 22, className }: InfiniteScrollGalleryProps) {
  return (
    <div className={className}>
      <style>{`
        @keyframes scroll-gallery {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .gallery-track {
          animation: scroll-gallery ${speed}s linear infinite;
        }
        .gallery-track:hover {
          animation-play-state: paused;
        }
        .gallery-mask {
          mask: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
          -webkit-mask: linear-gradient(90deg, transparent 0%, black 8%, black 92%, transparent 100%);
        }
      `}</style>

      <div className="gallery-mask w-full overflow-hidden">
        <div className="gallery-track flex gap-4 w-max">
          {duplicated.map((src, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-52 h-52 md:w-64 md:h-64 rounded-2xl overflow-hidden shadow-card cursor-pointer group"
            >
              <img
                src={src}
                alt={`Room ${(i % ROOM_IMAGES.length) + 1}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
