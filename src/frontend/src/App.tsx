import { useState, useEffect } from "react";
import { ErrorDisplay } from "./components";
import { ChatView, AuthView } from "./views";
import { authService, AuthUser } from "./services/auth";

function App() {
  const [error, setError] = useState<string | undefined>();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing auth session
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  }, []);

  const handleAuthSuccess = () => {
    setUser(authService.getCurrentUser());
    setError(undefined);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-indigo-500"></div>
      </div>
    );
  }

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

          {user ? (
            <>
              <div className="absolute top-4 right-4 z-10">
                <button
                  onClick={handleLogout}
                  className="rounded-md bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none"
                >
                  Logout
                </button>
              </div>
              <ChatView user={user} />
            </>
          ) : (
            <AuthView onSuccess={handleAuthSuccess} onError={setError} />
          )}
        </main>
      </div>
    </div>
  );
}

export default App;
