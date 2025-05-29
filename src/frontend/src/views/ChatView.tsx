import { useState, useRef, useEffect } from "react";
import { backend } from "../../../declarations/backend";
import { Logo } from "../components";
import { TypewriterText } from "../components/TypewriterText";
import { AuthUser, authService } from "../services/auth";
import { ChatMessage } from "../../../declarations/backend/backend.did";

interface ChatViewProps {
  user: AuthUser;
}

interface Message {
  content: string;
  role: "user" | "assistant";
  timestamp: number;
  id: string;
  conversationId: string;
  username?: string;
  isTyping?: boolean;
  error?: boolean;
  retryable?: boolean;
}

interface ChatHistory {
  id: string;
  title: string;
  timestamp: number;
  lastMessage: string;
  username: string;
}

const generateUniqueId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export function ChatView({ user }: ChatViewProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
  const [currentConversationId, setCurrentConversationId] =
    useState<string>(generateUniqueId());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const lastMessageRef = useRef<string>("");

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem(`chatHistory_${user.username}`);
    if (savedHistory) {
      setChatHistory(JSON.parse(savedHistory));
    }
  }, [user.username]);

  // Save chat history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(
      `chatHistory_${user.username}`,
      JSON.stringify(chatHistory),
    );
  }, [chatHistory, user.username]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
  };

  const handleRetry = async (message: string) => {
    if (!message) return;
    handleSendMessage(message);
  };

  const handleSendMessage = async (messageText: string) => {
    if (!messageText.trim()) return;

    const newMessage: Message = {
      content: messageText,
      role: "user",
      timestamp: Date.now(),
      id: generateUniqueId(),
      conversationId: currentConversationId,
      username: user.username,
    };

    setMessages((prev) => [...prev, newMessage]);
    setInput("");
    lastMessageRef.current = messageText;

    try {
      setLoading(true);
      const response = await backend.chat([
        { user: { content: messageText } },
      ] as ChatMessage[]);

      if (typeof response === "string") {
        const assistantMessage: Message = {
          content: response,
          role: "assistant",
          timestamp: Date.now(),
          id: generateUniqueId(),
          conversationId: currentConversationId,
          username: user.username,
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Update chat history
        const existingHistoryIndex = chatHistory.findIndex(
          (h) => h.id === currentConversationId,
        );
        if (existingHistoryIndex === -1) {
          const newHistory: ChatHistory = {
            id: currentConversationId,
            title: messageText.slice(0, 30) + "...",
            timestamp: Date.now(),
            lastMessage: response,
            username: user.username,
          };
          setChatHistory((prev) => [newHistory, ...prev]);
        } else {
          setChatHistory((prev) => {
            const updated = [...prev];
            updated[existingHistoryIndex] = {
              ...updated[existingHistoryIndex],
              lastMessage: response,
              timestamp: Date.now(),
            };
            return updated;
          });
        }
      }
    } catch (error) {
      const errorMessage: Message = {
        content: `Error: ${error instanceof Error ? error.message : "Failed to get response"}`,
        role: "assistant",
        timestamp: Date.now(),
        id: generateUniqueId(),
        conversationId: currentConversationId,
        username: user.username,
        error: true,
        retryable: true,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const startNewChat = () => {
    const newId = generateUniqueId();
    setCurrentConversationId(newId);
    setMessages([]);
  };

  const loadChatHistory = (history: ChatHistory) => {
    if (history.id === currentConversationId) return;

    setCurrentConversationId(history.id);

    // Load messages for this conversation
    const savedMessages = localStorage.getItem(
      `messages_${history.id}_${user.username}`,
    );
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    } else {
      setMessages([]);
    }
  };

  // Save messages whenever they change
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(
        `messages_${currentConversationId}_${user.username}`,
        JSON.stringify(messages),
      );
    }
  }, [messages, currentConversationId, user.username]);

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="flex w-64 flex-col bg-white/10 text-white backdrop-blur-lg">
        {/* New chat button */}
        <Logo />
        <button
          onClick={startNewChat}
          className="mx-4 mt-4 rounded-lg bg-indigo-600 px-4 py-3 text-sm text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg"
        >
          New Chat
        </button>

        {/* Chat history */}
        <div className="flex-1 space-y-2 overflow-y-auto px-2 py-4">
          {chatHistory
            .filter((h) => h.username === user.username)
            .map((chat) => (
              <button
                key={chat.id}
                onClick={() => loadChatHistory(chat)}
                className={`w-full rounded-lg px-4 py-3 text-left text-sm transition-all duration-300 hover:bg-white/10 ${
                  chat.id === currentConversationId ? "bg-white/15" : ""
                }`}
              >
                <div className="truncate font-medium">{chat.title}</div>
                <div className="truncate text-xs text-gray-300">
                  {chat.lastMessage}
                </div>
              </button>
            ))}
        </div>

        {/* Logout button at bottom */}
        <div className="border-t border-white/10 p-4">
          <div className="mb-2 flex items-center gap-3 px-4 py-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600">
              <span className="text-sm font-semibold">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1">
              <div className="truncate text-sm font-medium">
                {user.username}
              </div>
            </div>
          </div>
          <button
            onClick={() => authService.logout()}
            className="w-full rounded-lg border border-white/20 bg-transparent px-4 py-2 text-sm text-white transition-all duration-300 hover:bg-white/10"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex flex-1 flex-col bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5">
        {/* Chat messages */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4">
          {messages.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-white">
              <Logo className="mb-4 rounded-2xl bg-white" />
              <h1 className="mb-2 text-2xl font-bold">
                Welcome, {user.username}!
              </h1>
              <p>Start a new conversation or select a chat from the history.</p>
            </div>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-3/4 rounded-2xl p-4 shadow-md ${
                    message.role === "user"
                      ? "ml-12 bg-indigo-600 text-white"
                      : message.error
                        ? "mr-12 bg-red-50 text-red-700"
                        : "mr-12 bg-white text-gray-800"
                  }`}
                >
                  {message.error ? (
                    <>
                      <p>{message.content}</p>
                      {message.retryable && (
                        <button
                          className="mt-2 text-sm text-red-600 hover:text-red-800"
                          onClick={() => handleRetry(lastMessageRef.current)}
                        >
                          Retry
                        </button>
                      )}
                    </>
                  ) : message.isTyping ? (
                    <TypewriterText content={message.content} />
                  ) : (
                    message.content
                  )}
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          className="border-t border-gray-200 bg-white/50 p-4 backdrop-blur-sm"
        >
          <div className="mx-auto flex max-w-4xl gap-4">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 rounded-xl border border-gray-300 bg-white/80 px-4 py-3 backdrop-blur-sm transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="rounded-xl bg-indigo-600 px-6 py-3 text-white transition-all duration-300 hover:bg-indigo-700 hover:shadow-lg focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:outline-none disabled:opacity-50 disabled:hover:shadow-none"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="mr-2 h-5 w-5 animate-spin rounded-full border-t-2 border-white"></div>
                  Sending...
                </div>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
