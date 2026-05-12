'use client';

import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { useAlertContext } from '@/components/providers/alert-provider';
import { Button } from '@/components/ui/button';
import {
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Info,
  XCircle,
} from 'lucide-react';

export default function AlertDemo() {
  const { success, error, warning, info, addAlert, removeAlert } = useAlertContext();

  const handleSuccessAlert = () => {
    success('Success!', 'Your changes have been saved successfully.');
  };

  const handleErrorAlert = () => {
    error('Error', 'Something went wrong. Please try again.');
  };

  const handleWarningAlert = () => {
    warning('Warning', 'Please review your settings before continuing.');
  };

  const handleInfoAlert = () => {
    info('Information', 'You have new messages waiting.');
  };

  const handleCustomAlert = () => {
    addAlert('Custom Alert', 'This is a custom alert with primary variant', {
      variant: 'primary',
      appearance: 'solid',
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Alert Component Demo</h1>
          <p className="text-gray-600">Test various alert states and configurations</p>
        </div>

        {/* Interactive Buttons */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Interactive Alerts</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleSuccessAlert} className="bg-green-600 hover:bg-green-700">
              Show Success Alert
            </Button>
            <Button onClick={handleErrorAlert} className="bg-red-600 hover:bg-red-700">
              Show Error Alert
            </Button>
            <Button onClick={handleWarningAlert} className="bg-yellow-600 hover:bg-yellow-700">
              Show Warning Alert
            </Button>
            <Button onClick={handleInfoAlert} className="bg-blue-600 hover:bg-blue-700">
              Show Info Alert
            </Button>
            <Button onClick={handleCustomAlert} className="bg-purple-600 hover:bg-purple-700">
              Show Custom Alert
            </Button>
          </div>
        </div>

        {/* Static Examples */}
        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Static Examples</h2>
          </div>

          {/* Success - Solid */}
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-3">Success - Solid</p>
            <Alert variant="success" appearance="solid" size="md">
              <AlertIcon>
                <CheckCircle className="w-5 h-5" />
              </AlertIcon>
              <AlertContent>
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>Your account has been created successfully.</AlertDescription>
              </AlertContent>
            </Alert>
          </div>

          {/* Error - Light */}
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-3">Error - Light</p>
            <Alert variant="destructive" appearance="light" size="md" close onClose={() => {}}>
              <AlertIcon>
                <XCircle className="w-5 h-5" />
              </AlertIcon>
              <AlertContent>
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>Failed to save changes. Please try again later.</AlertDescription>
              </AlertContent>
            </Alert>
          </div>

          {/* Warning - Outline */}
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-3">Warning - Outline</p>
            <Alert variant="warning" appearance="outline" size="md">
              <AlertIcon>
                <AlertTriangle className="w-5 h-5" />
              </AlertIcon>
              <AlertContent>
                <AlertTitle>Warning</AlertTitle>
                <AlertDescription>
                  This action cannot be undone. Please proceed with caution.
                </AlertDescription>
              </AlertContent>
            </Alert>
          </div>

          {/* Info - Light */}
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-3">Info - Light</p>
            <Alert variant="info" appearance="light" size="md">
              <AlertIcon>
                <Info className="w-5 h-5" />
              </AlertIcon>
              <AlertContent>
                <AlertTitle>Information</AlertTitle>
                <AlertDescription>
                  Your profile is incomplete. Please add more details to complete setup.
                </AlertDescription>
              </AlertContent>
            </Alert>
          </div>

          {/* Secondary - Solid (Large) */}
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-3">Secondary - Solid (Large)</p>
            <Alert variant="secondary" appearance="solid" size="lg">
              <AlertIcon>
                <AlertCircle className="w-6 h-6" />
              </AlertIcon>
              <AlertContent>
                <AlertTitle>Notice</AlertTitle>
                <AlertDescription>
                  System maintenance scheduled for tomorrow at 2:00 AM. Services may be unavailable
                  during this time.
                </AlertDescription>
              </AlertContent>
            </Alert>
          </div>

          {/* Primary - Outline (Small) */}
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-3">Primary - Outline (Small)</p>
            <Alert variant="primary" appearance="outline" size="sm">
              <AlertIcon>
                <Info className="w-4 h-4" />
              </AlertIcon>
              <AlertContent>
                <AlertTitle>Tip</AlertTitle>
                <AlertDescription>Use the keyboard shortcut Cmd+K to search quickly.</AlertDescription>
              </AlertContent>
            </Alert>
          </div>

          {/* Mono variant with icon colors */}
          <div className="bg-white rounded-lg shadow p-4">
            <p className="text-sm text-gray-600 mb-3">Mono - Solid with Success Icon</p>
            <Alert variant="mono" appearance="solid" size="md" icon="success">
              <AlertIcon>
                <CheckCircle className="w-5 h-5 text-green-600" />
              </AlertIcon>
              <AlertContent>
                <AlertTitle>Operation Complete</AlertTitle>
                <AlertDescription>The requested operation has been completed successfully.</AlertDescription>
              </AlertContent>
            </Alert>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-blue-900 mb-3">Usage Instructions</h3>
          <pre className="bg-blue-900 text-blue-50 p-4 rounded overflow-x-auto text-sm">
{`// Using the context hook in your components:
import { useAlertContext } from '@/components/providers/alert-provider';

export function MyComponent() {
  const { success, error, warning, info } = useAlertContext();

  return (
    <button onClick={() => success('Success!', 'Operation completed')}>
      Show Alert
    </button>
  );
}

// Make sure to wrap your app with AlertProvider:
// In your root layout or page`}
          </pre>
        </div>
      </div>
    </div>
  );
}
