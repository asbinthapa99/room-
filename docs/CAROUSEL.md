# Room Image Gallery Carousel

Interactive carousel component for displaying room images with smooth animations, drag support, and navigation controls.

## Features

- **Smooth Animations**: Spring-based animations for natural motion
- **Drag Support**: Swipe/drag on mobile and desktop to navigate
- **Touch Friendly**: Full touch gesture support
- **Keyboard Accessible**: Arrow buttons for keyboard navigation
- **Responsive Design**: Adapts to different screen sizes
- **Image Optimization**: Uses Next.js Image component for performance
- **Auto Indicators**: Automatic slide position indicators
- **Image Counter**: Display current position (e.g., "1 / 5")
- **Single Item Optimization**: Disables drag when only one image

## Components

### RoomImageGallery

The main component that combines the carousel with room-specific features.

```tsx
import { RoomImageGallery } from '@/components/listings/RoomImageGallery';

<RoomImageGallery
  images={['image1.jpg', 'image2.jpg', 'image3.jpg']}
  title="Luxury Bedroom"
  className="rounded-lg overflow-hidden"
  alwaysShowNavigation={false}
/>
```

### RoomDetailsView

Complete room details page component with integrated carousel gallery.

```tsx
import { RoomDetailsView } from '@/components/listings/RoomDetailsView';

<RoomDetailsView
  listing={listing}
  isSaved={false}
  onContactClick={handleContact}
/>
```

## Props

### RoomImageGallery Props

```tsx
interface RoomImageGalleryProps {
  images: string[];           // Array of image URLs
  title?: string;            // Title for alt text
  className?: string;        // CSS class for wrapper
  imageClassName?: string;   // CSS class for images (e.g., aspect-video)
  alwaysShowNavigation?: boolean;  // Always show arrow buttons
}
```

### RoomDetailsView Props

```tsx
interface ListingViewProps {
  listing: {
    id: string;
    title: string;
    description: string;
    price: number;
    currency: string;
    city: string;
    country: string;
    address?: string | null;
    roomType: 'PRIVATE' | 'SHARED';
    billsIncluded: boolean;
    availableDate: Date;
    images: string[];
    landlord: {
      id: string;
      name: string;
      avatar: string | null;
      createdAt: Date;
    };
  };
  isSaved?: boolean;
  onContactClick?: () => void;
}
```

## Core Carousel Components

### Carousel

The main carousel wrapper.

```tsx
import { Carousel } from '@/components/ui/carousel';

<Carousel
  className="w-full"
  disableDrag={false}
  initialIndex={0}
  onIndexChange={(index) => console.log('Slide:', index)}
>
  {/* Carousel content */}
</Carousel>
```

### CarouselContent

Container for carousel items. Handles animation and dragging.

```tsx
import { CarouselContent } from '@/components/ui/carousel';

<CarouselContent className="h-96">
  {/* Items */}
</CarouselContent>
```

### CarouselItem

Individual slide wrapper.

```tsx
import { CarouselItem } from '@/components/ui/carousel';

<CarouselItem className="aspect-video">
  <img src="image.jpg" alt="Slide" />
</CarouselItem>
```

### CarouselNavigation

Arrow buttons for slide navigation.

```tsx
import { CarouselNavigation } from '@/components/ui/carousel';

<CarouselNavigation
  alwaysShow={false}
  classNameButton="bg-white p-2"
/>
```

### CarouselIndicator

Dot indicators showing current slide and total count.

```tsx
import { CarouselIndicator } from '@/components/ui/carousel';

<CarouselIndicator
  className="bottom-4 pb-2"
  classNameButton="h-2 w-2"
/>
```

## Usage Examples

### Basic Room Gallery

```tsx
'use client';

import { RoomImageGallery } from '@/components/listings/RoomImageGallery';

export function MyListing() {
  const images = [
    '/rooms/room-1.jpg',
    '/rooms/room-2.jpg',
    '/rooms/room-3.jpg',
  ];

  return (
    <RoomImageGallery
      images={images}
      title="Cozy Bedroom in City Center"
      className="rounded-lg overflow-hidden h-96"
    />
  );
}
```

### Custom Carousel

```tsx
'use client';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNavigation,
  CarouselIndicator,
} from '@/components/ui/carousel';
import Image from 'next/image';

export function CustomGallery() {
  const images = ['img1.jpg', 'img2.jpg', 'img3.jpg'];

  return (
    <Carousel>
      <CarouselContent className="h-96">
        {images.map((img, i) => (
          <CarouselItem key={i} className="aspect-video">
            <Image
              src={img}
              alt={`Slide ${i + 1}`}
              fill
              className="object-cover"
            />
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselNavigation alwaysShow={true} />
      <CarouselIndicator />
    </Carousel>
  );
}
```

### Full Room Details Page

```tsx
import { RoomDetailsView } from '@/components/listings/RoomDetailsView';

async function RoomPage({ params }: { params: { id: string } }) {
  const listing = await fetchListing(params.id);

  return <RoomDetailsView listing={listing} isSaved={false} />;
}
```

## Styling

### Custom Navigation Buttons

```tsx
<CarouselNavigation
  classNameButton="bg-gradient-to-r from-blue-500 to-purple-500 text-white p-3 rounded-full hover:shadow-lg"
/>
```

### Custom Indicators

```tsx
<CarouselIndicator
  className="bottom-6 gap-3"
  classNameButton="h-3 w-3 rounded-full"
/>
```

### Different Aspect Ratios

```tsx
// Square images
<RoomImageGallery
  images={images}
  imageClassName="aspect-square"
/>

// Widescreen
<RoomImageGallery
  images={images}
  imageClassName="aspect-video"
/>

// Ultra-wide
<RoomImageGallery
  images={images}
  imageClassName="aspect-[3/1]"
/>
```

## Accessibility

- ✓ Semantic HTML structure
- ✓ ARIA labels on navigation buttons
- ✓ Keyboard navigation support
- ✓ Screen reader friendly
- ✓ High contrast indicators
- ✓ Alt text for images

## Performance Tips

1. **Image Optimization**: Use responsive image sizes
   ```tsx
   sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 70vw"
   ```

2. **Priority Loading**: Mark first image as priority
   ```tsx
   priority={index === 0}
   ```

3. **Lazy Loading**: Non-priority images load on demand
4. **Next.js Image**: Automatic format optimization (WebP, AVIF)

## Common Issues

### Carousel not responding to drag
- Ensure `disableDrag={false}` (default)
- Check container has sufficient width
- Verify `cursor-grab` class is applied

### Images not loading
- Check image URLs are valid
- Ensure images are in public folder or CDN
- Verify Next.js image optimization is enabled

### Indicators not showing
- Ensure `itemsCount > 1`
- Check `CarouselIndicator` is rendered
- Verify CSS is applied

## Demo Page

Visit `/carousel-demo` to see the carousel in action with different configurations and sizes.

## Integration with RoomDetailsView

The `RoomDetailsView` component automatically integrates the carousel:

```tsx
// Images display in a carousel at the top
<RoomImageGallery
  images={listing.images}
  title={listing.title}
  className="w-full h-full"
/>

// All room details below
// Price card on desktop sidebar
// Contact/Save buttons
// Landlord information
```

## Browser Support

- ✓ Chrome/Edge 90+
- ✓ Firefox 88+
- ✓ Safari 14+
- ✓ Mobile browsers (iOS Safari, Chrome Mobile)

## Animation Customization

```tsx
<CarouselContent
  transition={{
    type: 'spring',
    damping: 15,
    stiffness: 100,
    duration: 0.3,
  }}
>
  {/* Items */}
</CarouselContent>
```

## Motion Library

Uses `motion/react` (Framer Motion v6+) for animations. Already configured in project.
