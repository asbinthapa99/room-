'use client';

import { useState } from 'react';
import { Feedback } from '@/components/ui/feedback';
import { useAlertContext } from '@/components/providers/alert-provider';

export default function FeedbackDemo() {
  const { success, info } = useAlertContext();
  const [feedbacks, setFeedbacks] = useState<Array<{ rating: number; message: string }>>([]);

  const handleFeedbackSubmit = (feedback: { rating: number; message: string }) => {
    setFeedbacks([...feedbacks, feedback]);
    const ratingLabels = ['Love it', 'Its okay', 'Not great', 'Hate it'];
    success(
      `Thank you!`,
      `Your feedback (${ratingLabels[feedback.rating]}) has been recorded.`
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Feedback Component</h1>
          <p className="text-gray-600">
            Collect user feedback after booking a room with emoji ratings and optional comments
          </p>
        </div>

        {/* Default Modal Feedback */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Default (Modal)</h2>
          <p className="text-gray-600 text-sm mb-6">
            Feedback opens in a modal popup when the button is clicked
          </p>
          <div className="flex gap-4">
            <Feedback
              label="Share Feedback"
              type="default"
              onSubmit={handleFeedbackSubmit}
            />
            <Feedback
              label="How was your stay?"
              type="default"
              onSubmit={handleFeedbackSubmit}
            />
          </div>
        </div>

        {/* Inline Feedback */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Inline (Expandable)</h2>
          <p className="text-gray-600 text-sm mb-6">
            Feedback expands inline when interacted with
          </p>
          <div className="flex gap-4">
            <Feedback
              label="Rate your experience"
              type="inline"
              onSubmit={handleFeedbackSubmit}
            />
            <Feedback
              label="How satisfied are you?"
              type="inline"
              onSubmit={handleFeedbackSubmit}
            />
          </div>
        </div>

        {/* Feedback History */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Feedback History</h2>
          {feedbacks.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No feedback submitted yet</p>
          ) : (
            <div className="space-y-3">
              {feedbacks.map((feedback, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-900">
                      Rating: {['Love it', 'Its okay', 'Not great', 'Hate it'][feedback.rating]}
                    </span>
                  </div>
                  <p className="text-gray-600 text-sm">{feedback.message || '(No message)'}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Features */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">Features</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-blue-800">
            <li>✓ Two display modes (default modal, inline expandable)</li>
            <li>✓ 4 emoji rating options (Love it, Its okay, Not great, Hate it)</li>
            <li>✓ Optional feedback message with textarea</li>
            <li>✓ Click outside to dismiss</li>
            <li>✓ Form submission handling</li>
            <li>✓ Keyboard accessible</li>
            <li>✓ Smooth animations and transitions</li>
            <li>✓ Mobile friendly</li>
          </ul>
        </div>

        {/* Usage Instructions */}
        <div className="mt-8 bg-green-50 border border-green-200 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-green-900 mb-3">Usage</h3>
          <pre className="bg-green-900 text-green-50 p-4 rounded overflow-x-auto text-sm">
{`// Basic usage
import { Feedback } from '@/components/ui/feedback';

export function BookingConfirmation() {
  const handleFeedback = (feedback) => {
    console.log('Rating:', feedback.rating);
    console.log('Message:', feedback.message);
    // Send to API
  };

  return (
    <Feedback
      label="How was your experience?"
      type="default"
      onSubmit={handleFeedback}
    />
  );
}

// Props:
// - label (required): Button/header text
// - type (optional): 'default' or 'inline' (default: 'default')
// - onSubmit (optional): Callback function with rating and message`}
          </pre>
        </div>

        {/* Post-Booking Integration */}
        <div className="mt-8 bg-purple-50 border border-purple-200 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-purple-900 mb-3">Post-Booking Integration</h3>
          <pre className="bg-purple-900 text-purple-50 p-4 rounded overflow-x-auto text-sm">
{`// After user confirms booking
<div className="booking-confirmation">
  <h2>Booking Confirmed!</h2>
  <p>Thank you for booking with us.</p>
  
  {/* Add feedback component */}
  <Feedback
    label="How was your experience?"
    type="inline"
    onSubmit={async (feedback) => {
      // Save to database
      await fetch('/api/feedback', {
        method: 'POST',
        body: JSON.stringify({
          bookingId: booking.id,
          rating: feedback.rating,
          message: feedback.message,
          timestamp: new Date()
        })
      });
    }}
  />
</div>`}
          </pre>
        </div>

        {/* Rating System */}
        <div className="mt-8 bg-gray-50 border border-gray-200 rounded-lg p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-3">Rating Scale</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <span className="text-lg">😍</span>
              <div>
                <p className="font-semibold text-gray-900">Love it (0)</p>
                <p className="text-sm text-gray-600">Excellent experience</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">🙂</span>
              <div>
                <p className="font-semibold text-gray-900">Its okay (1)</p>
                <p className="text-sm text-gray-600">Neutral experience</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">😕</span>
              <div>
                <p className="font-semibold text-gray-900">Not great (2)</p>
                <p className="text-sm text-gray-600">Below expectations</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg">😢</span>
              <div>
                <p className="font-semibold text-gray-900">Hate it (3)</p>
                <p className="text-sm text-gray-600">Poor experience</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
