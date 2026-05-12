'use client';

import { RoomImageGallery } from '@/components/listings/RoomImageGallery';

const mockRoomImages = [
  '/placeholder-room.jpg',
  '/placeholder-room.jpg',
  '/placeholder-room.jpg',
  '/placeholder-room.jpg',
  '/placeholder-room.jpg',
];

export default function CarouselDemo() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Room Image Gallery Carousel</h1>
          <p className="text-gray-600">Interactive carousel for viewing room images with smooth animations and drag support</p>
        </div>

        {/* Single Image */}
        <div className="mb-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Single Image (No Carousel)</h2>
          <RoomImageGallery
            images={['/placeholder-room.jpg']}
            title="Cozy Studio Apartment"
            className="rounded-lg overflow-hidden"
          />
        </div>

        {/* Multiple Images */}
        <div className="mb-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Multiple Images with Navigation</h2>
          <p className="text-gray-600 text-sm mb-4">Drag to navigate or use arrow buttons • Indicators show current position</p>
          <RoomImageGallery
            images={mockRoomImages}
            title="Luxury Bedroom with Garden View"
            className="rounded-lg overflow-hidden"
          />
        </div>

        {/* Always Show Navigation */}
        <div className="mb-12 bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Always Visible Navigation</h2>
          <p className="text-gray-600 text-sm mb-4">Navigation buttons always visible for easier control</p>
          <RoomImageGallery
            images={mockRoomImages}
            title="Modern Flat in City Center"
            className="rounded-lg overflow-hidden"
            alwaysShowNavigation={true}
          />
        </div>

        {/* Smaller Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Compact Gallery</h3>
            <RoomImageGallery
              images={mockRoomImages}
              title="Compact Room View"
              className="rounded-lg overflow-hidden"
              imageClassName="aspect-square"
            />
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Compact Gallery 2</h3>
            <RoomImageGallery
              images={mockRoomImages}
              title="Another Compact Room"
              className="rounded-lg overflow-hidden"
              imageClassName="aspect-square"
            />
          </div>
        </div>

        {/* Features List */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Features</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
            <li>✓ Smooth spring animations</li>
            <li>✓ Touch/drag support for mobile</li>
            <li>✓ Keyboard accessible navigation</li>
            <li>✓ Indicator dots for slide position</li>
            <li>✓ Arrow buttons with hover states</li>
            <li>✓ Image counter display</li>
            <li>✓ Responsive design</li>
            <li>✓ Optimized image loading</li>
          </ul>
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-green-900 mb-3">Usage</h3>
          <pre className="bg-green-900 text-green-50 p-4 rounded overflow-x-auto text-sm">
{`// Import the component
import { RoomImageGallery } from '@/components/listings/RoomImageGallery';

// Use in your page
<RoomImageGallery
  images={roomImages}
  title="Room Title"
  className="rounded-lg overflow-hidden"
  alwaysShowNavigation={false}
/>

// Images prop accepts array of image URLs
// Title is used for alt text
// Optional: className for wrapper styling
// Optional: imageClassName for image sizing
// Optional: alwaysShowNavigation to show buttons by default`}
          </pre>
        </div>
      </div>
    </div>
  );
}
