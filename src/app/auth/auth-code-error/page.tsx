import Link from 'next/link';

export default function AuthCodeError() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900 dark:text-white">
            Authentication Error
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            There was an error during the authentication process.
          </p>
        </div>
        <div className="rounded-md bg-red-50 dark:bg-red-900/10 p-4">
          <div className="text-sm text-red-700 dark:text-red-400">
            <p>
              The authentication process failed. This could be due to:
            </p>
            <ul className="mt-2 list-disc list-inside space-y-1">
              <li>OAuth configuration issues</li>
              <li>Invalid redirect URL</li>
              <li>Network connectivity problems</li>
            </ul>
          </div>
        </div>
        <div className="space-y-4">
          <Link
            href="/signin?next=/admin"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Try Again
          </Link>
          <Link
            href="/"
            className="w-full flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
