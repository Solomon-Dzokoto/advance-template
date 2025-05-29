import { useState } from "react";
import { ErrorDisplay } from "./components";
import { ChatView } from "./views";

function App() {
  const [error, setError] = useState<string | undefined>();

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Animated background */}
      <div className="animate-gradient-slow absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
        <div className="absolute inset-0 opacity-30">
          <div className="animate-blob absolute top-0 -left-4 h-72 w-72 rounded-full bg-purple-400 mix-blend-multiply blur-xl filter"></div>
          <div className="animate-blob animation-delay-2000 absolute top-0 -right-4 h-72 w-72 rounded-full bg-yellow-400 mix-blend-multiply blur-xl filter"></div>
          <div className="animate-blob animation-delay-4000 absolute -bottom-8 left-20 h-72 w-72 rounded-full bg-pink-400 mix-blend-multiply blur-xl filter"></div>
        </div>
      </div>

      {/* Content */}
      <div className="relative">
        <main className="min-h-screen">
          {error && (
            <ErrorDisplay message={error} onClose={() => setError(undefined)} />
          )}
          <ChatView />
        </main>
      </div>
    </div>
  );
}

export default App;
