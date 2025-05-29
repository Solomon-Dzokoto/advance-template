/**
 * Component for displaying error messages
 */
interface ErrorDisplayProps {
  message: string;
  onClose?: () => void;
}

export function ErrorDisplay({ message, onClose }: ErrorDisplayProps) {
  return (
    <div className="relative rounded-xl bg-white border-2 border-red-100 p-4 shadow-lg animate-slideIn">
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="flex-1 pt-0.5">
          <p className="text-sm text-red-900 font-medium">Error</p>
          <pre className="mt-1 text-sm text-red-600 whitespace-pre-wrap">{message}</pre>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="flex-shrink-0 inline-flex items-center justify-center w-6 h-6 rounded-full text-red-400 hover:text-red-500 hover:bg-red-100 transition-colors"
            aria-label="Close error message"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
