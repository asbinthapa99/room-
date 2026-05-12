# Feedback Component

Collect user feedback with emoji ratings and optional comments. Perfect for post-booking surveys and user experience feedback.

## Features

- **Two Display Modes**: Modal (default) and inline expandable
- **Emoji Ratings**: 4 sentiment options (Love it, Its okay, Not great, Hate it)
- **Optional Message**: Users can add detailed feedback via textarea
- **Smart Positioning**: Modal automatically positions above/below trigger button
- **Keyboard Accessible**: Full keyboard navigation support
- **Click Outside**: Closes feedback form when clicking outside
- **Form Validation**: Submit button only enabled when rating selected
- **Smooth Animations**: Transitions and spring animations
- **Mobile Friendly**: Responsive design for all screen sizes
- **Alert Integration**: Works seamlessly with alert/notification system

## Usage

### Basic Usage

```tsx
import { Feedback } from '@/components/ui/feedback';

export function MyComponent() {
  const handleFeedback = (feedback) => {
    console.log('Rating:', feedback.rating);        // 0, 1, 2, or 3
    console.log('Message:', feedback.message);      // User's text
  };

  return (
    <Feedback
      label="How was your stay?"
      type="default"
      onSubmit={handleFeedback}
    />
  );
}
```

### Props

```tsx
interface FeedbackProps {
  label: string;                                    // Required: Button/header text
  type?: 'default' | 'inline';                      // Optional: Display mode
  onSubmit?: (feedback: { rating: number; message: string }) => void;  // Optional: Callback
}
```

## Display Modes

### Default (Modal)

Feedback opens in a dropdown modal when button is clicked.

```tsx
<Feedback
  label="Share Feedback"
  type="default"
  onSubmit={handleFeedback}
/>
```

**Behavior:**
- Triggered by button click
- Opens below/above button (auto-positioned)
- Closes on click outside
- Fixed width 340px modal

### Inline (Expandable)

Feedback expands inline within the page flow.

```tsx
<Feedback
  label="Rate your experience"
  type="inline"
  onSubmit={handleFeedback}
/>
```

**Behavior:**
- Minimal UI when collapsed
- Expands when emoji clicked
- Textarea appears with send button
- Collapses when click outside

## Rating System

| Rating | Label | Emoji | Use Case |
|--------|-------|-------|----------|
| 0 | Love it | 😍 | Excellent experience |
| 1 | Its okay | 🙂 | Neutral/acceptable experience |
| 2 | Not great | 😕 | Below expectations |
| 3 | Hate it | 😢 | Poor experience |

## Post-Booking Integration

### Example: Booking Confirmation Page

```tsx
'use client';

import { Feedback } from '@/components/ui/feedback';
import { useAlertContext } from '@/components/providers/alert-provider';

export function BookingConfirmationPage({ booking }) {
  const { success, error } = useAlertContext();

  const handleFeedbackSubmit = async (feedback) => {
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bookingId: booking.id,
          userId: booking.userId,
          rating: feedback.rating,
          message: feedback.message,
          timestamp: new Date(),
        }),
      });

      if (!response.ok) throw new Error('Failed to submit feedback');

      success(
        'Thank you!',
        'Your feedback has been recorded.'
      );
    } catch (err) {
      error('Error', 'Failed to submit feedback. Please try again.');
    }
  };

  return (
    <div className="booking-confirmation">
      <h1>Booking Confirmed!</h1>
      <p>Thank you for booking with us.</p>
      <p>Booking ID: {booking.id}</p>
      
      {/* Add feedback component */}
      <div className="mt-8">
        <h2>Share Your Experience</h2>
        <Feedback
          label="How was your stay?"
          type="inline"
          onSubmit={handleFeedbackSubmit}
        />
      </div>
    </div>
  );
}
```

### Example: Modal in Dialog

```tsx
<div className="dialog">
  <h2>Booking Confirmation</h2>
  <p>Your booking is confirmed!</p>
  
  <Feedback
    label="Rate this booking"
    type="default"
    onSubmit={async (feedback) => {
      await submitFeedback(feedback);
      closeDialog();
    }}
  />
</div>
```

## API Endpoint Example

```typescript
// /api/feedback (POST)
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { bookingId, userId, rating, message } = body;

    // Validate
    if (rating < 0 || rating > 3) {
      return NextResponse.json(
        { error: 'Invalid rating' },
        { status: 400 }
      );
    }

    // Save to database
    const feedback = await db.feedback.create({
      data: {
        bookingId,
        userId,
        rating,
        message,
        createdAt: new Date(),
      },
    });

    return NextResponse.json({ success: true, feedback });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to submit feedback' },
      { status: 500 }
    );
  }
}
```

## Database Schema (Prisma)

```prisma
model Feedback {
  id        String    @id @default(cuid())
  booking   Booking   @relation(fields: [bookingId], references: [id], onDelete: Cascade)
  bookingId String
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  userId    String
  rating    Int       // 0-3
  message   String?   @db.Text
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([bookingId])
  @@index([userId])
}
```

## Styling Customization

### Modal Width

```tsx
<Feedback label="Feedback" type="default" />
// Adjust in feedback.tsx: w-[340px] to desired width
```

### Colors

The component uses:
- `bg-white` for backgrounds
- `bg-blue-300` for selected state
- `fill-blue-900` for selected icons
- `fill-amber-800` for love icon default
- `text-gray-900` for text

Modify these Tailwind classes in the component to match your theme.

### Animation

```tsx
// Default duration
duration-200

// Adjust timing by modifying className:
'duration-300'  // Slower
'duration-100'  // Faster
```

## Accessibility

- ✓ Semantic HTML structure
- ✓ ARIA labels on buttons
- ✓ Keyboard navigation (Tab, Enter, Escape)
- ✓ Screen reader support
- ✓ Focus management
- ✓ Form validation feedback

## Browser Support

- ✓ Chrome/Edge 90+
- ✓ Firefox 88+
- ✓ Safari 14+
- ✓ Mobile browsers

## Common Issues

### Feedback not submitting
- Check `onSubmit` callback is provided
- Verify rating is selected (0-3)
- Check console for errors

### Modal positioning issues
- Ensure container is not `overflow: hidden`
- Check z-index stacking context
- Test viewport height

### Textarea not focusing
- Verify `useClickOutside` hook is working
- Check ref is properly attached
- Ensure no other focus traps

## Demo Page

Visit `/feedback-demo` to see the feedback component in action with multiple examples and configurations.

## Dependencies

- `react`: React hooks (useState, useRef, useEffect)
- `@/components/ui/button-1`: Button component
- `@/components/ui/material-1`: Material card component
- `@/components/ui/textarea`: Textarea input
- `@/components/ui/use-click-outside`: Hook for dismissing
- `clsx`: Conditional class names
- `@/lib/utils`: Utility functions (cn)

## Tips

1. **Pre-fill Rating**: Pre-select a rating based on context
2. **Custom Messages**: Show different labels for different scenarios
3. **Required Feedback**: Make message required before allowing booking
4. **Ratings Analytics**: Track ratings to identify issues
5. **Auto-submit**: Auto-submit after rating selection
6. **Thank You Message**: Show alert after successful submission
7. **Rate Limiting**: Prevent multiple submissions from same user
8. **Conditional Display**: Only show after booking completion

## Performance

- Lightweight component (~5KB)
- No external dependencies beyond UI library
- Efficient re-renders with proper state management
- Debounced scroll/resize handlers for modal positioning
- CSS transitions for smooth animations

## Security Considerations

- Validate rating on backend (0-3 only)
- Sanitize message text before storing
- Rate limit feedback submissions
- Authenticate user before accepting feedback
- Validate bookingId belongs to user
