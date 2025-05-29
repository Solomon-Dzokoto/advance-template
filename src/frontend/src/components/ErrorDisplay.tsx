/**
 * Component for displaying error messages
 */
interface ErrorDisplayProps {
  message: string;
  onClose?: () => void;
}

export function ErrorDisplay({ message, onClose }: ErrorDisplayProps) {
  return (
    <div className="animate-slideIn relative rounded-xl border-2 border-red-100 bg-white p-4 shadow-lg">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg
            className="h-5 w-5 text-red-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1 pt-0.5">
          <p className="text-sm font-medium text-red-900">Error</p>
          <pre className="mt-1 text-sm whitespace-pre-wrap text-red-600">
            {message}
          </pre>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="inline-flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full text-red-400 transition-colors hover:bg-red-100 hover:text-red-500"
            aria-label="Close error message"
          >
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
