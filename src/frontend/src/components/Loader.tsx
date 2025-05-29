/**
 * Loading indicator component
 */
export function Loader() {
  return (
    <div className="flex flex-col items-center space-y-4">
      <div className="relative">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-200">
          <div className="absolute top-0 left-0 h-3 w-3 -translate-x-1/2 -translate-y-1/2 transform rounded-full bg-blue-500"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <svg
            className="h-6 w-6 animate-pulse text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 14l-7 7m0 0l-7-7m7 7V3"
            />
          </svg>
        </div>
      </div>
      <p className="animate-pulse text-sm font-medium text-blue-600">
        Loading...
      </p>
    </div>
  );
}
