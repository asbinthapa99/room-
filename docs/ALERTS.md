# Alert Component System

Complete alert/notification component system for displaying success, error, warning, and info messages throughout your application.

## Features

- **7 Variants**: secondary, primary, destructive, success, info, mono, warning
- **3 Appearances**: solid, outline, light
- **3 Sizes**: sm, md, lg
- **Auto-dismiss**: Configurable auto-close with custom duration
- **Global Context**: Access alerts from anywhere in your app
- **Dismissible**: Optional close button
- **Icon Support**: Built-in icons for each variant, or custom icons
- **Accessible**: Proper ARIA roles and semantic HTML

## Quick Start

### 1. Use the Alert Context Hook

The easiest way to show alerts is via the `useAlertContext` hook:

```tsx
'use client';

import { useAlertContext } from '@/components/providers/alert-provider';

export function MyComponent() {
  const { success, error, warning, info } = useAlertContext();

  return (
    <div>
      <button onClick={() => success('Success!', 'Changes saved')}>
        Save Changes
      </button>
      <button onClick={() => error('Error', 'Something went wrong')}>
        Show Error
      </button>
      <button onClick={() => warning('Warning', 'Please confirm this action')}>
        Show Warning
      </button>
      <button onClick={() => info('Info', 'New update available')}>
        Show Info
      </button>
    </div>
  );
}
```

### 2. Use Static Alert Components

For permanent alerts, use the component directly:

```tsx
import {
  Alert,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from '@/components/ui/alert';
import { CheckCircle } from 'lucide-react';

export function SuccessMessage() {
  return (
    <Alert variant="success" appearance="light" size="md">
      <AlertIcon>
        <CheckCircle className="w-5 h-5" />
      </AlertIcon>
      <AlertContent>
        <AlertTitle>Success</AlertTitle>
        <AlertDescription>Your changes have been saved.</AlertDescription>
      </AlertContent>
    </Alert>
  );
}
```

## Context Hook API

### `useAlertContext()`

Available methods:

#### `success(title, message, options?)`
Show a success alert with green color scheme.

```tsx
const { success } = useAlertContext();
success('Success!', 'Profile updated successfully');
```

#### `error(title, message, options?)`
Show an error alert with red color scheme. Default duration is 7000ms (longer than others).

```tsx
const { error } = useAlertContext();
error('Error', 'Failed to save. Please try again.');
```

#### `warning(title, message, options?)`
Show a warning alert with yellow color scheme.

```tsx
const { warning } = useAlertContext();
warning('Warning', 'This action cannot be undone.');
```

#### `info(title, message, options?)`
Show an info alert with blue/violet color scheme.

```tsx
const { info } = useAlertContext();
info('Info', 'New messages available');
```

#### `addAlert(title, message, options?)`
Show a custom alert with full control over options.

```tsx
const { addAlert } = useAlertContext();

addAlert('Custom Alert', 'Custom message', {
  variant: 'primary',
  appearance: 'solid',
  size: 'lg',
  close: true,
  duration: 10000, // 10 seconds
});
```

#### `removeAlert(id)`
Manually remove an alert by ID.

```tsx
const { removeAlert, addAlert } = useAlertContext();

const alertId = addAlert('Alert', 'Message', { close: false, duration: 0 });
// ... later
removeAlert(alertId);
```

## Component Props

### Alert Props

```tsx
interface AlertProps {
  variant?: 'primary' | 'destructive' | 'success' | 'info' | 'warning' | 'secondary' | 'mono';
  appearance?: 'solid' | 'outline' | 'light' | 'stroke';
  size?: 'sm' | 'md' | 'lg';
  close?: boolean;
  onClose?: () => void;
  icon?: string; // For mono variant
  children?: React.ReactNode;
}
```

### Options Object

```tsx
interface AlertOptions {
  variant?: AlertVariant; // primary | destructive | success | info | warning | secondary | mono
  appearance?: AlertAppearance; // solid | outline | light | stroke
  size?: AlertSize; // sm | md | lg
  close?: boolean; // Show close button (default: true)
  duration?: number; // Auto-dismiss duration in ms (0 = no dismiss, default: 5000)
  icon?: React.ReactNode; // Custom icon component
}
```

## Usage Examples

### Form Submission with Feedback

```tsx
'use client';

import { useAlertContext } from '@/components/providers/alert-provider';

export function SettingsForm() {
  const { success, error, loading } = useAlertContext();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: any) => {
    setIsSubmitting(true);
    const alertId = loading('Saving...', 'Please wait while your changes are being saved');

    try {
      await updateSettings(formData);
      success('Settings Saved', 'Your settings have been updated successfully');
    } catch (err) {
      error('Error', 'Failed to save settings. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
    </form>
  );
}
```

### API Response Handling

```tsx
'use client';

import { useAlertContext } from '@/components/providers/alert-provider';

export function ListingCard({ listing }: { listing: Listing }) {
  const { success, error } = useAlertContext();

  const handleSave = async () => {
    try {
      const res = await fetch('/api/saved', {
        method: 'POST',
        body: JSON.stringify({ listingId: listing.id }),
      });

      if (!res.ok) throw new Error('Failed to save');
      success('Saved!', 'Listing added to your saved items');
    } catch (err) {
      error('Error', 'Could not save listing. Please try again.');
    }
  };

  return <button onClick={handleSave}>Save Listing</button>;
}
```

### Custom Alert with Action

```tsx
const { addAlert } = useAlertContext();

addAlert('Confirm Action', 'Are you sure you want to delete this item?', {
  variant: 'warning',
  appearance: 'light',
  close: true,
  duration: 0, // Don't auto-dismiss
});
```

## Variants & Styling

### Color Schemes

- **primary**: Blue/brand color
- **destructive**: Red (error/delete actions)
- **success**: Green (successful operations)
- **warning**: Yellow/orange (caution actions)
- **info**: Violet/blue (informational messages)
- **secondary**: Gray (neutral messages)
- **mono**: Black (strong contrast)

### Appearance Modes

- **solid**: Filled background (high contrast)
- **outline**: Bordered with transparent background
- **light**: Soft background with border (recommended for general use)
- **stroke**: Text only (minimal)

### Sizes

- **sm**: Small (8px padding, smaller text)
- **md**: Medium (14px padding, default size)
- **lg**: Large (16px padding, larger text)

## Demo Page

Visit `/alert-demo` to see all alert variants and test the component interactively.

## Setup Requirements

The Alert system is already integrated into your app:

1. ✅ Alert components created in `/components/ui/alert.tsx`
2. ✅ AlertProvider added to root layout
3. ✅ Hooks created in `/lib/hooks/use-alert.ts`
4. ✅ Demo page available at `/alert-demo`

No additional setup is required. Start using alerts immediately!

## Accessibility

- Proper ARIA roles (`role="alert"`)
- Semantic HTML structure
- Keyboard navigation support
- Icon descriptions with alt text
- Close button with aria-label

## Best Practices

1. **Success alerts**: Use for completed actions
2. **Error alerts**: Always dismissible, longer duration (7s)
3. **Warning alerts**: Use for potentially destructive actions
4. **Info alerts**: Use for tips and notifications
5. **Keep messages brief**: One or two lines maximum
6. **Use descriptive titles**: Help users understand the context
7. **Auto-dismiss**: Enable for non-critical messages, disable for important ones

## Troubleshooting

### Alerts not showing?
- Ensure `AlertProvider` wraps your entire app (already done in layout.tsx)
- Check that you're using a client component (add `'use client'` directive)
- Verify you're calling methods from `useAlertContext()` hook

### Styling issues?
- Ensure Tailwind CSS is properly configured
- Check that CSS variables are defined for custom colors
- Verify dark mode classes if using dark mode

### TypeScript errors?
- Import types from `@/lib/hooks/use-alert`
- Ensure AlertProvider and hooks are imported correctly
