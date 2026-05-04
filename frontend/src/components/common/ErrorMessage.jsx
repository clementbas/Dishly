export default function ErrorMessage({ message, onRetry }) {
  if (!message) return null;
  return (
    <div
      className="rounded-xl px-4 py-3 text-sm flex items-center gap-3"
      style={{ backgroundColor: '#fde8e4', color: '#e23923', border: '1px solid #f5c6bf' }}
    >
      <svg width="16" height="16" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
      </svg>
      <span className="flex-1">{message}</span>
      {onRetry && (
        <button onClick={onRetry} className="underline text-xs font-medium">
          Réessayer
        </button>
      )}
    </div>
  );
}
