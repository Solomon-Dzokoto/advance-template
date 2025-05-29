export function Logo() {
  return (
    <div className="flex items-center gap-2 p-2">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 shadow-lg">
        <span className="text-xl font-bold text-white">@</span>
      </div>
      <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-lg font-semibold text-transparent">
        ChaKam <span className="hidden md:inline">Chat</span>
      </span>
    </div>
  );
}
