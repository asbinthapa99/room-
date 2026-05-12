'use client';

import Image from 'next/image';
import {
  Carousel,
  CarouselContent,
  CarouselNavigation,
  CarouselIndicator,
  CarouselItem,
} from '@/components/ui/carousel';
import { cn } from '@/lib/utils';

export interface RoomImageGalleryProps {
  images: string[];
  title?: string;
  className?: string;
  imageClassName?: string;
  alwaysShowNavigation?: boolean;
}

export function RoomImageGallery({
  images,
  title,
  className,
  imageClassName,
  alwaysShowNavigation = false,
}: RoomImageGalleryProps) {
  // Use placeholder if no images
  const displayImages = images.length > 0 ? images : ['/placeholder-room.jpg'];

  return (
    <div className={cn('relative w-full', className)}>
      <Carousel
        className="w-full"
        disableDrag={displayImages.length === 1}
      >
        <CarouselContent className="h-full">
          {displayImages.map((image, index) => (
            <CarouselItem
              key={index}
              className={cn('aspect-video relative', imageClassName)}
            >
              <Image
                src={image}
                alt={title ? `${title} - Image ${index + 1}` : `Room image ${index + 1}`}
                fill
                className="object-cover w-full h-full"
                priority={index === 0}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
              />
            </CarouselItem>
          ))}
        </CarouselContent>

        {displayImages.length > 1 && (
          <>
            <CarouselNavigation
              alwaysShow={alwaysShowNavigation}
              className="h-full"
            />
            <CarouselIndicator className="bottom-4 pb-2" />
          </>
        )}
      </Carousel>

      {displayImages.length > 1 && (
        <div className="absolute top-4 right-4 z-20 bg-black/50 text-white px-3 py-1 rounded-full text-sm font-medium">
          {1} / {displayImages.length}
        </div>
      )}
    </div>
  );
}

export default RoomImageGallery;
