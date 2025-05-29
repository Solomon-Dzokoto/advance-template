

export function Logo() {
    return (
        <div className="flex items-center gap-2 p-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">@</span>
            </div>
            <span className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                ChaKam <span className="hidden md:inline">Chat</span>
            </span>
        </div>
    );
}
